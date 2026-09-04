<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Profile extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'date_of_birth',
        'religion',
        'mother_tongue',
        'country',
        'city',
        'marital_status',
        'has_children',
        'children_count',
        'custody_arrangement',
        'family_type',
        'education',
        'institution',
        'profession',
        'employer',
        'income_bracket',
        'height',
        'languages',
        'lifestyle_values',
        'hobbies',
        'about_me',
        'profile_visibility',
        'profile_completion',
        'verification_status',
        'trust_score',
    ];

    protected $casts = [
        'has_children' => 'boolean',
        'languages' => 'array',
        'lifestyle_values' => 'array',
        'hobbies' => 'array',
        'date_of_birth' => 'date',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
