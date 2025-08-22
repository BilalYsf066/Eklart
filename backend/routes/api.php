<?php
// routes/api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminAuthController;

use App\Http\Controllers\Api\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// === Public Categories ===
Route::get('/categories', [CategoryController::class, 'publicIndex']);

// === Auth public ===
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Health-check : lit toujours via la garde Sanctum (même si pas authentifié)
    Route::get('/check', function (Request $request) {
        $user = auth('sanctum')->user(); // <- cohérent avec les routes protégées
        return response()->json([
            'authenticated' => (bool) $user,
            'user' => $user,
        ]);
    });

    // Routes protégées (auth Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });
});

// === Auth Admin ===
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);

    // Protégé par Sanctum + middleware "admin"
    Route::middleware(['auth:admin', 'admin'])->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/users', [AdminAuthController::class, 'getUsers']);
        Route::get('/applications', [AdminAuthController::class, 'getPendingApplications']);
        Route::post('/applications/{id}/approve', [AdminAuthController::class, 'approveApplication']);
        Route::post('/applications/{id}/reject', [AdminAuthController::class, 'rejectApplication']);

        // Routes pour la gestion des catégories par l'admin
        Route::apiResource('categories', CategoryController::class)->except(['index']);
        Route::get('categories', [CategoryController::class, 'adminIndex']);
    });
});

// === Autres routes protégées de l'app ===
Route::middleware('auth:sanctum')->group(function () {
    // ... tes autres endpoints applicatifs
});