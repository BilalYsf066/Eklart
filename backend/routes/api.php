<?php
// routes/api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Artisan\ArticleController as ArtisanArticleController;
use App\Http\Controllers\Api\Artisan\OrderController as ArtisanOrderController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReviewController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// === Public Routes ===
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{article}', [ArticleController::class, 'show']);
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

// === Routes pour les artisans ===
Route::middleware(['auth:sanctum'])->prefix('artisan')->group(function () {
    Route::post('/articles/{article}/publish', [ArtisanArticleController::class, 'publish']);
    Route::apiResource('articles', ArtisanArticleController::class);
    Route::get('/orders', [ArtisanOrderController::class, 'index']);
    Route::put('/orders/{order}/status', [ArtisanOrderController::class, 'updateStatus']);
});

// === Autres routes protégées de l'app ===
Route::middleware('auth:sanctum')->group(function () {
    // === Cart Routes ===
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::post('/cart/merge', [CartController::class, 'merge']);
    Route::put('/cart/{article}', [CartController::class, 'update']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);
    Route::delete('/cart/{article}', [CartController::class, 'destroy']);
    
    // === Reviews Route ===
    Route::post('/articles/{article}/reviews', [ReviewController::class, 'store']);

    // === Order Route ===
    Route::post('/orders', [OrderController::class, 'store']);

    // === Profile Routes ===
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::put('/password', [ProfileController::class, 'updatePassword']);
        Route::post('/delete', [ProfileController::class, 'destroy']);
    });

    // === Autres endpoints applicatifs ===
});