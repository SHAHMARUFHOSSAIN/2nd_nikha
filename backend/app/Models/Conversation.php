<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model {
    use HasFactory;

    protected $fillable = [
        'match_id',
        'status',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public function match() {
        return $this->belongsTo(MatchModel::class, 'match_id');
    }

    public function participants() {
        return $this->belongsToMany(User::class, 'conversation_participants', 'conversation_id', 'user_id')
                    ->withPivot('joined_at', 'last_read_at');
    }

    public function messages() {
        return $this->hasMany(Message::class);
    }

    public function sharedPhotos() {
        return $this->hasMany(SharedPhoto::class);
    }

    public function sharedContacts() {
        return $this->hasMany(SharedContact::class);
    }
}
