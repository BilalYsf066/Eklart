<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    /**
     * Display a listing of all categories for public users.
     */
    public function publicIndex(): JsonResponse
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    /**
     * Display a listing of the resource for admin.
     */
    public function adminIndex(): JsonResponse
    {
        // Eager load the admin relationship to get the creator's name
        $categories = Category::with('admin:id,name')->get();
        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        $user = Auth::user();

        if (!$user || $user->role !== \App\Models\User::ROLE_ADMIN) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé. Seuls les administrateurs peuvent créer des catégories.'
            ], 403);
        }

        $category = Category::create([
            'name' => $request->name,
            'admin_id' => $user->id,
        ]);

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category): JsonResponse
    {
        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update($request->all());

        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json(['message' => 'Catégorie supprimée avec succès.'], 200);
    }
}