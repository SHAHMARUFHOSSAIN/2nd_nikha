<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'gender',
        'role',
        'status',
        'email_verified_at',
        'phone_verified_at',
        'last_active_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'last_active_at' => 'datetime',
    ];

    public function profile() {
        return $this->hasOne(Profile::class);
    }

    public function photos() {
        return $this->hasMany(ProfilePhoto::class);
    }

    public function preference() {
        return $this->hasOne(ProfilePreference::class);
    }

    public function sentInterests() {
        return $this->hasMany(Interest::class, 'sender_id');
    }

    public function receivedInterests() {
        return $this->hasMany(Interest::class, 'receiver_id');
    }

    public function subscriptions() {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription() {
        return $this->hasOne(Subscription::class)->where('status', 'ACTIVE')->where('expires_at', '>', now());
    }

    public function isPremium(): bool {
        return $this->role === 'PREMIUM' || $this->activeSubscription()->exists();
    }
}
