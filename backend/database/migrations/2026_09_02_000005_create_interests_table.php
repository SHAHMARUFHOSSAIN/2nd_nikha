<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('interests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['DRAFT', 'PAYMENT_PENDING', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'])->default('SENT');
            $table->timestamps();

            $table->index('sender_id');
            $table->index('receiver_id');
            $table->index('status');
            $table->unique(['sender_id', 'receiver_id', 'status'], 'interests_sender_receiver_status_unique');
        });
    }

    public function down(): void {
        Schema::dropIfExists('interests');
    }
};
