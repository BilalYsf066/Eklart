<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        
        if ($user->isArtisan()) {
            $user->load(['artisan' => function($query) {
                $query->withCount('articles');
            }]);
        } else {
            $user->load('client');
        }

        return response()->json($user);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'required|string|max:255|unique:users,phone,' . $user->id,
        ]);

        $user->update($validated);

        if ($user->isClient()) {
            $request->validate([
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:255',
            ]);
            $user->client()->updateOrCreate(
                ['user_id' => $user->id],
                ['address' => $request->address, 'city' => $request->city]
            );
        }

        if ($user->isArtisan()) {
            $request->validate([
                'shop_name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);
            $user->artisan()->update([
                'shop_name' => $request->shop_name,
                'description' => $request->description,
            ]);
        }

        return $this->show($request);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'string', 'confirmed', Password::min(8)],
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }
    
    public function destroy(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'password' => 'required|string',
        ]);

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Le mot de passe est incorrect.'], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Votre compte a été supprimé avec succès.']);
    }
}