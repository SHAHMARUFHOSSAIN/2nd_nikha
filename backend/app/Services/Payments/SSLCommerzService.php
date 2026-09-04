<?php

namespace App\Services\Payments;

use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use App\Models\MembershipPlan;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SSLCommerzService {
    protected string $storeId;
    protected string $storePassword;
    protected bool $isSandbox;
    protected string $baseUrl;

    public function __construct() {
        $this->storeId = config('services.sslcommerz.store_id', env('SSLCOMMERZ_STORE_ID', 'sandbox_store'));
        $this->storePassword = config('services.sslcommerz.store_password', env('SSLCOMMERZ_STORE_PASSWORD', 'sandbox_pass'));
        $this->isSandbox = config('services.sslcommerz.is_sandbox', env('SSLCOMMERZ_IS_SANDBOX', true));

        $this->baseUrl = $this->isSandbox
            ? 'https://sandbox.sslcommerz.com'
            : 'https://securepay.sslcommerz.com';
    }

    /**
     * Initiate payment session with SSLCommerz gateway
     */
    public function createSession(User $user, float $amount, string $transactionId, string $purpose = 'subscription'): array {
        $postData = [
            'store_id' => $this->storeId,
            'store_passwd' => $this->storePassword,
            'total_amount' => $amount,
            'currency' => 'BDT',
            'tran_id' => $transactionId,
            'success_url' => url("/api/v1/payments/sslcommerz/success?tran_id={$transactionId}"),
            'fail_url' => url("/api/v1/payments/sslcommerz/fail?tran_id={$transactionId}"),
            'cancel_url' => url("/api/v1/payments/sslcommerz/cancel?tran_id={$transactionId}"),
            'ipn_url' => url("/api/v1/payments/sslcommerz/ipn"),
            'cus_name' => $user->name,
            'cus_email' => $user->email,
            'cus_add1' => 'Dhaka',
            'cus_city' => 'Dhaka',
            'cus_postcode' => '1200',
            'cus_country' => 'Bangladesh',
            'cus_phone' => $user->phone ?? '01700000000',
            'shipping_method' => 'NO',
            'product_name' => '2nd Chance Premium Membership',
            'product_category' => 'Matrimonial Service',
            'product_profile' => 'non-physical-goods',
        ];

        try {
            $response = Http::asForm()->post("{$this->baseUrl}/gwprocess/v4/api.php", $postData);
            $result = $response->json();

            if (isset($result['status']) && $result['status'] === 'SUCCESS') {
                return [
                    'success' => true,
                    'gateway_url' => $result['GatewayPageURL'] ?? null,
                    'transaction_id' => $transactionId,
                    'sessionkey' => $result['sessionkey'] ?? null,
                ];
            }

            Log::error('SSLCommerz Session Initiation Failed', ['response' => $result]);
            return [
                'success' => false,
                'message' => $result['failedreason'] ?? 'Failed to initiate gateway payment session.',
            ];
        } catch (\Exception $e) {
            Log::error('SSLCommerz Service Exception', ['error' => $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Payment gateway connection error.',
            ];
        }
    }

    /**
     * Server-Side Verification of Transaction via SSLCommerz Validator API
     */
    public function validateTransaction(string $valId, string $transactionId, float $expectedAmount): bool {
        $validationUrl = "{$this->baseUrl}/validator/api/validationserverAPI.php?" . http_build_query([
            'val_id' => $valId,
            'store_id' => $this->storeId,
            'store_passwd' => $this->storePassword,
            'format' => 'json',
        ]);

        try {
            $response = Http::get($validationUrl);
            $result = $response->json();

            if (
                isset($result['status']) &&
                ($result['status'] === 'VALID' || $result['status'] === 'VALIDATED') &&
                $result['tran_id'] === $transactionId &&
                ((float) $result['amount']) >= $expectedAmount
            ) {
                return true;
            }

            Log::warning('SSLCommerz Transaction Validation Mismatch', ['result' => $result]);
            return false;
        } catch (\Exception $e) {
            Log::error('SSLCommerz Validation Exception', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Handle Successful Payment Callback & Activate Subscription Atomic Workflows
     */
    public function handleSuccess(array $payload): bool {
        $transactionId = $payload['tran_id'] ?? null;
        $valId = $payload['val_id'] ?? null;
        $amount = (float) ($payload['amount'] ?? 0);

        if (!$transactionId) return false;

        $payment = Payment::where('transaction_id', $transactionId)->first();
        if (!$payment) return false;

        // Server-side validation check
        $isValid = $this->validateTransaction($valId, $transactionId, $amount);
        if (!$isValid && !$this->isSandbox) {
            $payment->update(['status' => 'FAILED', 'raw_response' => $payload]);
            return false;
        }

        // Mark payment as PAID
        $payment->update([
            'status' => 'PAID',
            'gateway_transaction_id' => $valId,
            'paid_at' => now(),
            'raw_response' => $payload,
        ]);

        // Activate User Subscription
        $subscription = Subscription::find($payment->subscription_id);
        if ($subscription) {
            $subscription->update([
                'status' => 'ACTIVE',
                'started_at' => now(),
                'expires_at' => now()->addMonth(),
            ]);

            // Upgrade User Role to PREMIUM
            $payment->user->update(['role' => 'PREMIUM']);
        }

        return true;
    }

    public function handleFailure(array $payload): void {
        $transactionId = $payload['tran_id'] ?? null;
        if ($transactionId) {
            Payment::where('transaction_id', $transactionId)->update([
                'status' => 'FAILED',
                'raw_response' => $payload,
            ]);
        }
    }

    public function handleCancel(array $payload): void {
        $transactionId = $payload['tran_id'] ?? null;
        if ($transactionId) {
            Payment::where('transaction_id', $transactionId)->update([
                'status' => 'CANCELLED',
                'raw_response' => $payload,
            ]);
        }
    }
}
