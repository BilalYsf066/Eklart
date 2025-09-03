<?php
// app/Http/Controllers/Api/AdminAuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AdminLoginRequest;
use App\Models\User;
use App\Models\Artisan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AdminAuthController extends Controller
{
    public function login(AdminLoginRequest $request): JsonResponse
    {
        try {
            $credentials = $request->validated();

            // Vérification des identifiants admin prédéfinis
            if (
                $credentials['email'] === 'admin@eklart.com' &&
                $credentials['password'] === 'Password123!'
            ) {

                // Créer ou récupérer l'admin
                $admin = User::firstOrCreate([
                    'email' => 'admin@eklart.com'
                ], [
                    'first_name' => 'Admin',
                    'last_name' => 'Eklart',
                    'password' => Hash::make('Password123!'),
                    'role' => User::ROLE_ADMIN,
                ]);

                //Auth::guard('admin')->login($admin, $request->boolean('remember', false));
                Auth::login($admin, $request->boolean('remember', false));
                //$token = $admin->createToken('admin-token')->plainTextToken;


                return response()->json([
                    'success' => true,
                    'message' => 'Connexion admin réussie.',
                    'user' => [
                        'id' => $admin->id,
                        'first_name' => $admin->first_name,
                        'last_name' => $admin->last_name,
                        'full_name' => $admin->full_name,
                        'email' => $admin->email,
                        'role' => $admin->role,
                        'is_admin' => true,
                    ],
                    //'token' => $token,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Identifiants administrateur incorrects.',
            ], 401);
        } catch (\Exception $e) {
            Log::error('Erreur connexion admin: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la connexion.',
            ], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion admin réussie.',
        ]);
    }

    public function getUsers(Request $request): JsonResponse
    {
        try {
            $users = User::with('artisan')->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->full_name,
                    'identifier' => $user->email ?: $user->phone,
                    'role' => $user->role,
                    'joinDate' => $user->created_at->format('Y-m-d'),
                    'status' => 'Actif',
                ];
            });

            return response()->json([
                'success' => true,
                'users' => $users,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des utilisateurs.',
            ], 500);
        }
    }

    public function getPendingApplications(Request $request): JsonResponse
    {
        //if (Auth::user()->role != User::ROLE_ADMIN) {
        //    return response()->json(['success' => false, 'message' => 'Accès non autorisé.'], 403);
        //}
        try {
            $applications = Artisan::with('user')
                ->where('validation_status', Artisan::STATUS_PENDING)
                ->get()
                ->map(function ($artisan) {
                    return [
                        'id' => $artisan->id,
                        'name' => $artisan->user->full_name,
                        'email' => $artisan->user->email,
                        'phone' => $artisan->user->phone,
                        'shopName' => $artisan->shop_name,
                        'description' => $artisan->description,
                        'identityDocument' => $artisan->identity_document_path,
                        'submitDate' => $artisan->created_at->format('Y-m-d'),
                        'status' => 'pending',
                    ];
                });

            return response()->json([
                'success' => true,
                'applications' => $applications,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des demandes.',
            ], 500);
        }
    }

    public function approveApplication(Request $request, $id): JsonResponse
    {
        try {
            $artisan = Artisan::with('user')->findOrFail($id);

            if ($artisan->validation_status !== Artisan::STATUS_PENDING) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette demande a déjà été traitée.',
                ], 400);
            }

            // Approuver l'artisan
            $artisan->update([
                'validation_status' => Artisan::STATUS_APPROVED,
                'validated_at' => now(),
                'validated_by' => Auth::id(),
            ]);

            // Envoyer notification
            $this->sendApprovalNotification($artisan->user);

            return response()->json([
                'success' => true,
                'message' => 'Demande approuvée avec succès.',
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur approbation artisan: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'approbation.',
            ], 500);
        }
    }

    public function rejectApplication(Request $request, $id): JsonResponse
    {
        try {
            $artisan = Artisan::with('user')->findOrFail($id);

            if ($artisan->validation_status !== Artisan::STATUS_PENDING) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette demande a déjà été traitée.',
                ], 400);
            }

            // Rejeter l'artisan
            $artisan->update([
                'validation_status' => Artisan::STATUS_REJECTED,
                'validated_at' => now(),
                'validated_by' => Auth::id(),
                'rejection_reason' => $request->input('reason', 'Non spécifiée'),
            ]);

            // Envoyer notification de rejet
            $this->sendRejectionNotification($artisan->user, $request->input('reason'));

            return response()->json([
                'success' => true,
                'message' => 'Demande rejetée.',
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur rejet artisan: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rejet.',
            ], 500);
        }
    }

    private function sendApprovalNotification(User $user): void
    {
        try {
            // Si l'utilisateur a un email, envoyer par email
            if ($user->email) {
                // TODO: Implémenter l'envoi d'email
                Log::info("Email d'approbation envoyé à: " . $user->email);
            }
            // Sinon, envoyer par SMS
            elseif ($user->phone) {
                // TODO: Implémenter l'envoi de SMS
                Log::info("SMS d'approbation envoyé à: " . $user->phone);
            }
        } catch (\Exception $e) {
            Log::error('Erreur envoi notification approbation: ' . $e->getMessage());
        }
    }

    private function sendRejectionNotification(User $user, ?string $reason): void
    {
        try {
            // Si l'utilisateur a un email, envoyer par email
            if ($user->email) {
                // TODO: Implémenter l'envoi d'email de rejet
                Log::info("Email de rejet envoyé à: " . $user->email);
            }
            // Sinon, envoyer par SMS
            elseif ($user->phone) {
                // TODO: Implémenter l'envoi de SMS de rejet
                Log::info("SMS de rejet envoyé à: " . $user->phone);
            }
        } catch (\Exception $e) {
            Log::error('Erreur envoi notification rejet: ' . $e->getMessage());
        }
    }
}
