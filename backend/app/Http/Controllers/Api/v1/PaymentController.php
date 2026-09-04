<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\MembershipPlan;
use App\Models\Payment;
use App\Models\Subscription;
use App\Services\Payments\SSLCommerzService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller {
    protected SSLCommerzService $sslCommerz;

    public function __construct(SSLCommerzService $sslCommerz) {
        $this->sslCommerz = $sslCommerz;
    }

    public function initiateSSLCommerz(Request $request) {
        $user = $request->user();

        $validated = $request->validate([
            'membership_plan_id' => 'nullable|exists:membership_plans,id',
            'amount' => 'nullable|numeric|min:10',
            'purpose' => 'nullable|string|in:subscription,interest',
        ]);

        $plan = MembershipPlan::find($validated['membership_plan_id'] ?? 1);
        $amount = $validated['amount'] ?? ($plan ? $plan->price : 1499.00);
        $transactionId = 'TXN_' . date('Ymd') . '_' . Str::random(8);

        // Create Pending Subscription
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'membership_plan_id' => $plan ? $plan->id : 1,
            'status' => 'PENDING',
            'amount' => $amount,
            'currency' => 'BDT',
            'transaction_id' => $transactionId,
            'gateway' => 'SSLCOMMERZ',
        ]);

        // Create Pending Payment Record
        Payment::create([
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'transaction_id' => $transactionId,
            'amount' => $amount,
            'currency' => 'BDT',
            'gateway' => 'SSLCOMMERZ',
            'status' => 'PENDING',
        ]);

        // Call SSLCommerz Gateway Abstraction
        $sessionResult = $this->sslCommerz->createSession($user, $amount, $transactionId, $validated['purpose'] ?? 'subscription');

        if ($sessionResult['success']) {
            return response()->json([
                'success' => true,
                'data' => [
                    'gateway_url' => $sessionResult['gateway_url'],
                    'transaction_id' => $transactionId,
                    'amount' => $amount,
                ],
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $sessionResult['message'] ?? 'Payment session initiation failed.',
        ], 500);
    }

    public function handleSuccess(Request $request) {
        $this->sslCommerz->handleSuccess($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Payment verified server-side. Premium subscription activated!',
        ]);
    }

    public function handleFail(Request $request) {
        $this->sslCommerz->handleFailure($request->all());

        return response()->json([
            'success' => false,
            'message' => 'Payment transaction failed or was rejected.',
        ], 400);
    }

    public function handleCancel(Request $request) {
        $this->sslCommerz->handleCancel($request->all());

        return response()->json([
            'success' => false,
            'message' => 'Payment transaction was cancelled by user.',
        ]);
    }

    public function handleIPN(Request $request) {
        $success = $this->sslCommerz->handleSuccess($request->all());

        return response()->json(['status' => $success ? 'VALIDATED' : 'FAILED']);
    }
}
