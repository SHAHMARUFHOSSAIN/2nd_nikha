<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['TEXT', 'IMAGE', 'CONTACT', 'SYSTEM'])->default('TEXT');
            $table->text('content');
            $table->enum('status', ['SENT', 'DELIVERED', 'READ', 'FAILED'])->default('SENT');
            $table->timestamp('read_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('conversation_id');
            $table->index('sender_id');
            $table->index('created_at');
        });
    }

    public function down(): void {
        Schema::dropIfExists('messages');
    }
};
