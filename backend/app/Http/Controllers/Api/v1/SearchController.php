<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;

class SearchController extends Controller {
    public function search(Request $request) {
        $user = $request->user();

        $query = Profile::query()
            ->with(['user', 'user.photos'])
            ->whereHas('user', function ($q) use ($user) {
                $q->where('status', 'ACTIVE');
                if ($user && $user->gender) {
                    // Opposite gender match default
                    $targetGender = $user->gender === 'Male' ? 'Female' : 'Male';
                    $q->where('gender', $targetGender);
                }
            });

        if ($request->has('religion') && $request->religion) {
            $query->where('religion', $request->religion);
        }

        if ($request->has('city') && $request->city) {
            $query->where('city', $request->city);
        }

        if ($request->has('marital_status') && $request->marital_status) {
            $query->where('marital_status', $request->marital_status);
        }

        if ($request->has('verified') && $request->boolean('verified')) {
            $query->where('verification_status', 'Verified');
        }

        $perPage = $request->input('per_page', 15);
        $profiles = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $profiles,
        ]);
    }
}
