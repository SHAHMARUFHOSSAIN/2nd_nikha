<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('profile_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->integer('age_min')->default(21);
            $table->integer('age_max')->default(60);
            $table->string('religion_preference')->nullable();
            $table->string('specific_religion')->nullable();
            $table->string('location_preference')->nullable();
            $table->string('education_preference')->nullable();
            $table->json('marital_status_preference')->nullable();
            $table->string('children_preference')->nullable();
            $table->string('height_preference')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('profile_preferences');
    }
};
