<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchModel extends Model {
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'user_one_id',
        'user_two_id',
        'compatibility_score',
        'status',
        'matched_at',
    ];

    protected $casts = [
        'matched_at' => 'datetime',
    ];

    public function userOne() {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    public function userTwo() {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    public function conversation() {
        return $this->hasOne(Conversation::class, 'match_id');
    }
}
