<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('date_of_birth')->nullable();
            $table->string('religion')->default('Islam');
            $table->string('mother_tongue')->nullable();
            $table->string('country')->default('Bangladesh');
            $table->string('city')->default('Dhaka');
            $table->enum('marital_status', ['Divorced', 'Widowed', 'Single Parent', 'Never Married'])->default('Divorced');
            $table->boolean('has_children')->default(false);
            $table->integer('children_count')->default(0);
            $table->string('custody_arrangement')->nullable();
            $table->string('family_type')->nullable();
            $table->string('education');
            $table->string('institution')->nullable();
            $table->string('profession');
            $table->string('employer')->nullable();
            $table->string('income_bracket')->nullable();
            $table->string('height')->default("5' 6\"");
            $table->json('languages')->nullable();
            $table->json('lifestyle_values')->nullable();
            $table->json('hobbies')->nullable();
            $table->text('about_me')->nullable();
            $table->enum('profile_visibility', ['PUBLIC', 'MEMBERS_ONLY', 'PRIVATE'])->default('PUBLIC');
            $table->integer('profile_completion')->default(70);
            $table->enum('verification_status', ['Verified', 'Pending', 'Unverified'])->default('Unverified');
            $table->integer('trust_score')->default(80);
            $table->softDeletes();
            $table->timestamps();

            $table->index('user_id');
            $table->index('religion');
            $table->index('city');
            $table->index('marital_status');
        });
    }

    public function down(): void {
        Schema::dropIfExists('profiles');
    }
};
