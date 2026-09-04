<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('membership_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('price', 10, 2);
            $table->string('currency', 10)->default('BDT');
            $table->enum('billing_interval', ['MONTHLY', 'QUARTERLY', 'YEARLY'])->default('MONTHLY');
            $table->boolean('is_active')->default(true);
            $table->json('features')->nullable();
            $table->timestamps();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('membership_plan_id')->constrained('membership_plans')->onDelete('cascade');
            $table->enum('status', ['PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED'])->default('PENDING');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('BDT');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->string('transaction_id')->nullable();
            $table->string('gateway', 50)->default('SSLCOMMERZ');
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained('subscriptions')->onDelete('set null');
            $table->string('transaction_id')->unique();
            $table->string('gateway_transaction_id')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('BDT');
            $table->string('gateway', 50)->default('SSLCOMMERZ');
            $table->enum('status', ['PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED'])->default('PENDING');
            $table->json('raw_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('transaction_id');
            $table->index('status');
        });
    }

    public function down(): void {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('membership_plans');
    }
};
