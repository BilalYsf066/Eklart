<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artisan;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::with('artisan')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->artisan ? $user->artisan->validation_status : 'active', // Placeholder logic for status
                'role' => strtolower($user->role),
            ];
        });
        return response()->json($users);
    }

    public function artisanApplications(): JsonResponse
    {
        $applications = Artisan::with('user')
            ->where('validation_status', Artisan::STATUS_PENDING)
            ->get()
            ->map(function ($artisan) {
                return [
                    'id' => $artisan->id,
                    'name' => $artisan->user->full_name,
                    'identifier' => $artisan->user->email ?? $artisan->user->phone,
                    'shopName' => $artisan->shop_name,
                    'identityDocument' => $artisan->identity_document_path, // just path for now
                    'status' => strtolower($artisan->validation_status),
                ];
            });
        return response()->json($applications);
    }

    public function approveArtisan(Artisan $artisan): JsonResponse
    {
        $artisan->validation_status = Artisan::STATUS_APPROVED;
        $artisan->validated_at = now();
        // Assuming admin user ID 1 is approving. This should be dynamic later.
        $artisan->validated_by = 1; 
        $artisan->save();

        return response()->json(['message' => 'Artisan application approved.']);
    }
    
    public function rejectArtisan(Artisan $artisan): JsonResponse
    {
        // Or change status to REJECTED
        $artisan->validation_status = Artisan::STATUS_REJECTED;
        $artisan->rejection_reason = 'Rejected by admin.'; // A reason could be added
        $artisan->save();

        // If you truly want to delete: $artisan->user->delete(); which cascades.
        
        return response()->json(['message' => 'Artisan application rejected.']);
    }

    public function destroy(User $user): JsonResponse
    {
        // Add policy check here later to prevent admin from deleting self
        $user->delete();
        return response()->json(null, 204);
    }
}