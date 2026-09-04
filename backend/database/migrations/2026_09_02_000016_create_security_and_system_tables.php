<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->string('notifiable_type');
            $table->unsignedBigInteger('notifiable_id');
            $table->json('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['notifiable_type', 'notifiable_id']);
        });

        Schema::create('blocked_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blocker_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('blocked_id')->constrained('users')->onDelete('cascade');
            $table->text('reason')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['blocker_id', 'blocked_id'], 'blocked_users_unique');
        });

        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('reported_user_id')->constrained('users')->onDelete('cascade');
            $table->string('reason');
            $table->text('description')->nullable();
            $table->enum('status', ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'])->default('PENDING');
            $table->text('admin_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('reporter_id');
            $table->index('reported_user_id');
        });

        Schema::create('verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['EMAIL', 'PHONE', 'IDENTITY'])->default('IDENTITY');
            $table->string('nid_number')->nullable();
            $table->string('document_reference')->nullable();
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED'])->default('PENDING');
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
        });

        Schema::create('profile_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visitor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('visited_user_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('visited_at')->useCurrent();
            $table->timestamp('created_at')->useCurrent();

            $table->index('visitor_id');
            $table->index('visited_user_id');
        });
    }

    public function down(): void {
        Schema::dropIfExists('profile_visits');
        Schema::dropIfExists('verifications');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('blocked_users');
        Schema::dropIfExists('notifications');
    }
};
