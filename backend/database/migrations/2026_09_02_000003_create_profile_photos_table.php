<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('profile_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('path', 500);
            $table->string('thumbnail_path', 500)->nullable();
            $table->enum('privacy', ['PUBLIC', 'PRIVATE', 'PREMIUM_ONLY', 'MATCH_ONLY'])->default('PUBLIC');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->enum('status', ['APPROVED', 'PENDING_REVIEW', 'REJECTED'])->default('APPROVED');
            $table->softDeletes();
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void {
        Schema::dropIfExists('profile_photos');
    }
};
