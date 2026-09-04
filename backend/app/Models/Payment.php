<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model {
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_id',
        'transaction_id',
        'gateway_transaction_id',
        'amount',
        'currency',
        'gateway',
        'status',
        'raw_response',
        'paid_at',
    ];

    protected $casts = [
        'raw_response' => 'array',
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function subscription() {
        return $this->belongsTo(Subscription::class);
    }
}
