<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('shared_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->string('path', 500);
            $table->softDeletes();
            $table->timestamps();

            $table->index('conversation_id');
        });

        Schema::create('shared_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
            $table->foreignId('shared_by')->constrained('users')->onDelete('cascade');
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->timestamps();

            $table->index('conversation_id');
        });
    }

    public function down(): void {
        Schema::dropIfExists('shared_contacts');
        Schema::dropIfExists('shared_photos');
    }
};
