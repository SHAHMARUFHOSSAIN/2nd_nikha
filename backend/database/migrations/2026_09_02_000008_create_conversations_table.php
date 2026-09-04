<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->unique()->constrained('matches')->onDelete('cascade');
            $table->enum('status', ['ACTIVE', 'BLOCKED', 'ENDED'])->default('ACTIVE');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();
        });

        Schema::create('conversation_participants', function (Blueprint $table) {
            $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamp('last_read_at')->nullable();

            $table->primary(['conversation_id', 'user_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('conversation_participants');
        Schema::dropIfExists('conversations');
    }
};
