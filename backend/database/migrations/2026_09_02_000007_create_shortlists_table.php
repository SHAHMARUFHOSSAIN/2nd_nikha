<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('shortlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('profile_user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'profile_user_id'], 'shortlists_user_profile_unique');
        });
    }

    public function down(): void {
        Schema::dropIfExists('shortlists');
    }
};
