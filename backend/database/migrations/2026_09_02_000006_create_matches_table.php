<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_one_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('user_two_id')->constrained('users')->onDelete('cascade');
            $table->integer('compatibility_score')->default(85);
            $table->enum('status', ['ACTIVE', 'BLOCKED', 'ENDED'])->default('ACTIVE');
            $table->timestamp('matched_at')->useCurrent();
            $table->timestamps();

            $table->index('user_one_id');
            $table->index('user_two_id');
            $table->unique(['user_one_id', 'user_two_id'], 'matches_users_unique');
        });
    }

    public function down(): void {
        Schema::dropIfExists('matches');
    }
};
