<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Conversation;
use App\Models\MatchModel;

class ConversationPolicy {
    /**
     * Determine whether user can view or interact with conversation
     */
    public function view(User $user, Conversation $conversation): bool {
        return $this->isParticipantInActiveMatch($user, $conversation);
    }

    public function sendMessage(User $user, Conversation $conversation): bool {
        return $this->isParticipantInActiveMatch($user, $conversation);
    }

    public function shareContact(User $user, Conversation $conversation): bool {
        return $this->isParticipantInActiveMatch($user, $conversation);
    }

    public function sharePhoto(User $user, Conversation $conversation): bool {
        return $this->isParticipantInActiveMatch($user, $conversation);
    }

    protected function isParticipantInActiveMatch(User $user, Conversation $conversation): bool {
        // Business Rule: Conversation must belong to an ACTIVE match
        if ($conversation->status !== 'ACTIVE') {
            return false;
        }

        $match = MatchModel::find($conversation->match_id);
        if (!$match || $match->status !== 'ACTIVE') {
            return false;
        }

        // Must be a participant
        return $conversation->participants()->where('user_id', $user->id)->exists();
    }
}
