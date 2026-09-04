<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\SharedContact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConversationController extends Controller {
    public function index(Request $request) {
        $user = $request->user();

        $conversations = Conversation::whereHas('participants', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })
        ->with(['match', 'participants.profile', 'messages' => function ($q) {
            $q->latest()->limit(1);
        }])
        ->where('status', 'ACTIVE')
        ->latest('last_message_at')
        ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $conversations,
        ]);
    }

    public function messages(Request $request, $id) {
        $user = $request->user();
        $conversation = Conversation::findOrFail($id);

        // Security check: Must be an active participant
        if (!$conversation->participants()->where('user_id', $user->id)->exists() || $conversation->status !== 'ACTIVE') {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. You do not belong to this active matched conversation.',
            ], 403);
        }

        $messages = Message::where('conversation_id', $conversation->id)
            ->latest()
            ->paginate(30);

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    public function sendMessage(Request $request, $id) {
        $user = $request->user();
        $conversation = Conversation::findOrFail($id);

        if (!$conversation->participants()->where('user_id', $user->id)->exists() || $conversation->status !== 'ACTIVE') {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. Active match required to send messages.',
            ], 403);
        }

        $validated = $request->validate([
            'type' => 'nullable|in:TEXT,IMAGE,CONTACT,SYSTEM',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'type' => $validated['type'] ?? 'TEXT',
            'content' => $validated['content'],
            'status' => 'SENT',
        ]);

        $conversation->update(['last_message_at' => now()]);

        return response()->json([
            'success' => true,
            'data' => $message,
        ], 201);
    }

    public function shareContact(Request $request, $id) {
        $user = $request->user();
        $conversation = Conversation::findOrFail($id);

        if (!$conversation->participants()->where('user_id', $user->id)->exists() || $conversation->status !== 'ACTIVE') {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. Contact details can only be shared inside an active matched conversation.',
            ], 403);
        }

        $validated = $request->validate([
            'phone' => 'nullable|string',
            'whatsapp' => 'nullable|string',
            'email' => 'nullable|email',
        ]);

        $contact = SharedContact::create([
            'conversation_id' => $conversation->id,
            'shared_by' => $user->id,
            'phone' => $validated['phone'] ?? $user->phone,
            'whatsapp' => $validated['whatsapp'] ?? $user->phone,
            'email' => $validated['email'] ?? $user->email,
        ]);

        // Send a system contact message
        Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'type' => 'CONTACT',
            'content' => "Shared contact information: Phone: {$contact->phone}, WhatsApp: {$contact->whatsapp}",
            'status' => 'SENT',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Contact details shared securely inside conversation.',
            'data' => $contact,
        ], 201);
    }
}
