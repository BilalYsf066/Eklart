<?php
// app/Services/AuthService.php

namespace App\Services;

use App\Models\User;
use App\Models\Artisan;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthService
{
    public function register(array $data): User
    {
        return DB::transaction(function () use ($data) {
            // Créer l'utilisateur
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'password' => Hash::make($data['password']),
                'role' => $data['is_artisan'] ? User::ROLE_ARTISAN : User::ROLE_CLIENT,
            ]);

            // Si c'est un artisan, créer le profil artisan
            if ($data['is_artisan'] && isset($data['identity_document'])) {
                $this->createArtisanProfile($user, $data);

                // Log de notification pour l'admin
                Log::info('Nouvelle demande d\'inscription artisan', [
                    'user_id' => $user->id,
                    'user_name' => $user->full_name,
                    'shop_name' => $data['shop_name'],
                    'contact' => $user->email ?: $user->phone,
                ]);
            }

            return $user;
        });
    }

    public function login(array $credentials, bool $remember = false): ?User
    {
        // Déterminer le champ de connexion
        $loginField = isset($credentials['email']) && !empty($credentials['email'])
            ? 'email'
            : 'phone';

        $loginValue = $credentials[$loginField];

        // Trouver l'utilisateur
        $user = User::where($loginField, $loginValue)->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return null;
        }

        return $user;
    }

    private function createArtisanProfile(User $user, array $data): void
    {
        // Stocker le document d'identité
        $documentPath = $this->storeIdentityDocument($data['identity_document']);

        Artisan::create([
            'user_id' => $user->id,
            'shop_name' => $data['shop_name'],
            'description' => $data['description'] ?? null,
            'identity_document_path' => $documentPath,
            'validation_status' => Artisan::STATUS_PENDING,
        ]);
    }

    private function storeIdentityDocument(UploadedFile $file): string
    {
        // Générer un nom unique pour le fichier
        $filename = time() . '_' . $file->getClientOriginalName();

        // Stocker dans storage/app/private/identity_documents
        return $file->storeAs('identity_documents', $filename, 'public');
    }
}
