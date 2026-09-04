<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller {
    public function register(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:30|unique:users',
            'gender' => 'required|in:Male,Female',
            'password' => 'required|string|min:8|confirmed',
            'date_of_birth' => 'nullable|date',
            'marital_status' => 'required|in:Divorced,Widowed,Single Parent,Never Married',
            'religion' => 'nullable|string',
            'city' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'gender' => $validated['gender'],
                'password' => Hash::make($validated['password']),
                'role' => 'FREE',
                'status' => 'ACTIVE',
            ]);

            Profile::create([
                'user_id' => $user->id,
                'date_of_birth' => $validated['date_of_birth'] ?? '1995-01-01',
                'religion' => $validated['religion'] ?? 'Islam',
                'marital_status' => $validated['marital_status'],
                'city' => $validated['city'] ?? 'Dhaka',
                'country' => 'Bangladesh',
                'education' => 'Bachelor Degree',
                'profession' => 'Private Service Holder',
                'about_me' => 'Looking for a genuine second chance in marriage with mutual trust and respect.',
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully.',
                'data' => [
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'gender' => $user->gender,
                        'role' => $user->role,
                    ],
                ],
            ], 201);
        });
    }

    public function login(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if ($user->status === 'SUSPENDED' || $user->status === 'BLOCKED') {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been suspended or blocked.',
            ], 403);
        }

        $user->update(['last_active_at' => now()]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully.',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'gender' => $user->gender,
                    'role' => $user->role,
                    'is_premium' => $user->isPremium(),
                ],
            ],
        ]);
    }

    public function me(Request $request) {
        $user = $request->user()->load('profile', 'photos');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'is_premium' => $user->isPremium(),
            ],
        ]);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }
}
