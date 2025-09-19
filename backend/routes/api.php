<?php
// routes/api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Artisan\ArticleController as ArtisanArticleController;
use App\Http\Controllers\Api\Artisan\OrderController as ArtisanOrderController;
use App\Http\Controllers\Api\Artisan\DashboardController as ArtisanDashboardController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\ReviewController as AdminReviewController;

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
    Route::get('/stats', [ArtisanDashboardController::class, 'getStats']);
    Route::get('/orders', [ArtisanOrderController::class, 'index']);
    Route::put('/orders/{order}/status', [ArtisanOrderController::class, 'updateStatus']);
});

// === Admin Panel Routes ===
// For now, they are protected by sanctum, later we will add an admin middleware
Route::prefix('admin')->group(function () {
    // Admin Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AdminAuthController::class, 'login']);
        Route::middleware('auth:admin-api')->group(function () {
            Route::post('/logout', [AdminAuthController::class, 'logout']);
            Route::get('/user', [AdminAuthController::class, 'user']);
        });
    });

    // Protected Admin Routes
    Route::middleware('auth:admin-api')->group(function () {
        // Users
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);
        Route::get('/artisan-applications', [AdminUserController::class, 'artisanApplications']);
        Route::post('/artisan-applications/{artisan}/approve', [AdminUserController::class, 'approveArtisan']);
        Route::post('/artisan-applications/{artisan}/reject', [AdminUserController::class, 'rejectArtisan']);
    
        // Categories
        Route::get('/categories', [AdminCategoryController::class, 'index']);
        Route::post('/categories', [AdminCategoryController::class, 'store']);
        Route::put('/categories/{category}', [AdminCategoryController::class, 'update']);
        Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy']);

        // Articles
        Route::get('/articles', [AdminArticleController::class, 'index']);
        Route::post('/articles/{article}/toggle-visibility', [AdminArticleController::class, 'toggleVisibility']);
        Route::delete('/articles/{article}', [AdminArticleController::class, 'destroy']);

        // Orders
        Route::get('/orders', [AdminOrderController::class, 'index']);

        // Reviews
        Route::get('/reviews', [AdminReviewController::class, 'index']);
        Route::post('/reviews/{review}/toggle-visibility', [AdminReviewController::class, 'toggleVisibility']);
        Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy']);
    });
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
    Route::get('/orders', [OrderController::class, 'index']);

    // === Profile Routes ===
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::put('/password', [ProfileController::class, 'updatePassword']);
        Route::post('/delete', [ProfileController::class, 'destroy']);
    });

    // === Autres endpoints applicatifs ===
});