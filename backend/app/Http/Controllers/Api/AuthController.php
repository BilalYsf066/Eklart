<?php
// app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = $this->authService->register($request->validated());

            // Connecter automatiquement l'utilisateur
            Auth::login($user);

            // Message personnalisé selon le type d'utilisateur
            $message = $request->boolean('is_artisan')
                ? 'Inscription réussie. Votre demande d\'artisan est en cours de traitement.'
                : 'Inscription réussie.';

            // Create API token
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => $message,
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'is_artisan' => $user->isArtisan(),
                    'artisan' => $user->artisan ? [
                        'shop_name' => $user->artisan->shop_name,
                        'description' => $user->artisan->description,
                        'validation_status' => $user->artisan->validation_status,
                        'is_approved' => $user->artisan->isApproved(),
                    ] : null,
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur inscription: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $user = $this->authService->login(
                $request->validated(),
                (bool) ($request['remember'] ?? false)
            );

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Identifiants incorrects.',
                ], 401);
            }

            // Connecter l'utilisateur
            Auth::login($user, (bool) ($request['remember'] ?? false));

            // Create API token
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie.',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'is_artisan' => $user->isArtisan(),
                    'artisan' => $user->artisan ? [
                        'shop_name' => $user->artisan->shop_name,
                        'description' => $user->artisan->description,
                        'validation_status' => $user->artisan->validation_status,
                        'is_approved' => $user->artisan->isApproved(),
                    ] : null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur connexion: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();
        
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie.',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié.',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_artisan' => $user->isArtisan(),
                'artisan' => $user->artisan ? [
                    'shop_name' => $user->artisan->shop_name,
                    'description' => $user->artisan->description,
                    'validation_status' => $user->artisan->validation_status,
                    'is_approved' => $user->artisan->isApproved(),
                ] : null,
            ],
        ]);
    }

    public function checkAuth(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        return response()->json([
            'authenticated' => Auth::check(),
            'user' => $user ? [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'full_name' => $user->full_name,
                'role' => $user->role,
                'is_artisan' => $user->isArtisan(),
                'is_admin' => $user->role === User::ROLE_ADMIN,
            ] : null,
        ]);
    }
}
