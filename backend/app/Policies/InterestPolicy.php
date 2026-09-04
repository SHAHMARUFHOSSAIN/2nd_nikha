<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Interest;
use App\Models\BlockedUser;

class InterestPolicy {
    /**
     * Determine whether user can send interest to target profile user
     */
    public function create(User $user, User $receiver): bool {
        // Business Rule 1: A user cannot send Interest to themselves
        if ($user->id === $receiver->id) {
            return false;
        }

        // Business Rule 2: A FREE user cannot create an Interest. Only PREMIUM users can send Interests.
        if (!$user->isPremium()) {
            return false;
        }

        // Business Rule 3: Check if blocked by target user or user blocked target
        $isBlocked = BlockedUser::where(function ($q) use ($user, $receiver) {
            $q->where('blocker_id', $user->id)->where('blocked_id', $receiver->id);
        })->orWhere(function ($q) use ($user, $receiver) {
            $q->where('blocker_id', $receiver->id)->where('blocked_id', $user->id);
        })->exists();

        if ($isBlocked) {
            return false;
        }

        // Business Rule 4: Prevent duplicate active interests
        $hasActiveInterest = Interest::where('sender_id', $user->id)
            ->where('receiver_id', $receiver->id)
            ->whereIn('status', ['DRAFT', 'SENT', 'ACCEPTED'])
            ->exists();

        return !$hasActiveInterest;
    }

    public function accept(User $user, Interest $interest): bool {
        return $interest->receiver_id === $user->id && $interest->status === 'SENT';
    }

    public function reject(User $user, Interest $interest): bool {
        return $interest->receiver_id === $user->id && $interest->status === 'SENT';
    }
}
