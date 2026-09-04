<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model {
    use HasFactory;

    protected $fillable = [
        'user_id',
        'membership_plan_id',
        'status',
        'amount',
        'currency',
        'started_at',
        'expires_at',
        'transaction_id',
        'gateway',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function plan() {
        return $this->belongsTo(MembershipPlan::class, 'membership_plan_id');
    }

    public function payments() {
        return $this->hasMany(Payment::class);
    }
}
