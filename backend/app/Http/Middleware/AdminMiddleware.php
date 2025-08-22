<?php
// app/Http/Middleware/AdminMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user('admin'); // ← lit l'user depuis la garde admin
        if (!$user || $user->role !== \App\Models\User::ROLE_ADMIN) {
            return response()->json(['success' => false, 'message' => 'Accès non autorisé.'], 403);
        }
        return $next($request);
    }
}
