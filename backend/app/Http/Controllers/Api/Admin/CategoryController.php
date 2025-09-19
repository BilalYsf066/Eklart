<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('articles')->get();
        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(['name' => 'required|string|unique:categories|max:255']);
        
        $category = Category::create([
            'name' => $validated['name'],
            'admin_id' => 1, // Placeholder for authenticated admin ID
        ]);

        return response()->json($category->loadCount('articles'), 201);
    }
    
    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate(['name' => 'required|string|max:255|unique:categories,name,' . $category->id]);
        $category->update($validated);
        return response()->json($category->loadCount('articles'));
    }

    public function destroy(Category $category): JsonResponse
    {
        // Add check if category has articles later
        $category->delete();
        return response()->json(null, 204);
    }
}