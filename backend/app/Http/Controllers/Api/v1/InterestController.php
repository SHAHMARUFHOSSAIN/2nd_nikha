<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Interest;
use App\Models\MatchModel;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InterestController extends Controller {
    public function send(Request $request) {
        $user = $request->user();

        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
        ]);

        $receiver = User::findOrFail($validated['receiver_id']);

        // Business Rule 1: Cannot send Interest to self
        if ($user->id === $receiver->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot send an Interest to yourself.',
            ], 422);
        }

        // Business Rule 2: Only Premium members can send Interest
        if (!$user->isPremium()) {
            return response()->json([
                'success' => false,
                'message' => 'Only Premium members can send Interests. Please upgrade your subscription.',
            ], 403);
        }

        // Business Rule 3: Check duplicate active interest
        $existing = Interest::where('sender_id', $user->id)
            ->where('receiver_id', $receiver->id)
            ->whereIn('status', ['SENT', 'ACCEPTED'])
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'An active Interest already exists between you and this profile.',
            ], 422);
        }

        $interest = Interest::create([
            'sender_id' => $user->id,
            'receiver_id' => $receiver->id,
            'status' => 'SENT',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Interest sent successfully.',
            'data' => $interest->load('receiver.profile'),
        ], 201);
    }

    public function received(Request $request) {
        $interests = Interest::with(['sender.profile', 'sender.photos'])
            ->where('receiver_id', $request->user()->id)
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $interests,
        ]);
    }

    public function sent(Request $request) {
        $interests = Interest::with(['receiver.profile', 'receiver.photos'])
            ->where('sender_id', $request->user()->id)
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $interests,
        ]);
    }

    public function accept(Request $request, $id) {
        $user = $request->user();
        $interest = Interest::findOrFail($id);

        if ($interest->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to accept this interest.',
            ], 403);
        }

        if ($interest->status !== 'SENT') {
            return response()->json([
                'success' => false,
                'message' => 'Interest is no longer pending.',
            ], 422);
        }

        // Atomic DB Transaction: Accept Interest -> Create Match -> Create Conversation
        return DB::transaction(function () use ($interest, $user) {
            $interest->update(['status' => 'ACCEPTED']);

            // Create Match record
            $match = MatchModel::create([
                'user_one_id' => min($interest->sender_id, $user->id),
                'user_two_id' => max($interest->sender_id, $user->id),
                'compatibility_score' => 88,
                'status' => 'ACTIVE',
                'matched_at' => now(),
            ]);

            // Create Conversation room
            $conversation = Conversation::create([
                'match_id' => $match->id,
                'status' => 'ACTIVE',
                'last_message_at' => now(),
            ]);

            // Attach Conversation Participants
            $conversation->participants()->attach([
                $interest->sender_id => ['joined_at' => now()],
                $user->id => ['joined_at' => now()],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Interest accepted successfully! Match and conversation room created.',
                'data' => [
                    'interest_id' => $interest->id,
                    'match_id' => $match->id,
                    'conversation_id' => $conversation->id,
                ],
            ]);
        });
    }

    public function reject(Request $request, $id) {
        $user = $request->user();
        $interest = Interest::findOrFail($id);

        if ($interest->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $interest->update(['status' => 'REJECTED']);

        return response()->json([
            'success' => true,
            'message' => 'Interest declined.',
        ]);
    }
}
