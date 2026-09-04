<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipPlan extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'price',
        'currency',
        'billing_interval',
        'is_active',
        'features',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'features' => 'array',
        'price' => 'decimal:2',
    ];
}
