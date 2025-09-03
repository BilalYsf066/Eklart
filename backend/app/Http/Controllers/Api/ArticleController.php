<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ArticleController extends Controller
{
    /**
     * Get all articles by a specific artisan.
     */
    public function getByArtisan($artisan_id)
    {
        $articles = Article::where('artisan_id', $artisan_id)->get();
        return response()->json([
            'success' => true,
            'message' => 'Articles récupérés avec succès.',
            'articles' => $articles
        ]);
    }
    /**
     * Display a listing of the articles.
     */
    public function index()
    {
        $articles = Article::all();
        return response()->json([
            'success' => true,
            'message' => 'Articles récupérés avec succès.',
            'articles' => $articles
        ]);
    }

    /**
     * Store a newly created article in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'artisan_id' => 'required|exists:artisans,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('articles', 'public');
            $validated['image'] = $path;
        }

        $article = Article::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Article créé avec succès.',
            'article' => $article
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified article.
     */
    public function show($id)
    {
        $article = Article::findOrFail($id);
        return response()->json([
            'success' => true,
            'message' => 'Article récupéré avec succès.',
            'article' => $article
        ]);
    }

    /**
     * Update the specified article in storage.
     */
    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        $validated = $request->validate([
            'artisan_id' => 'sometimes|required|exists:artisans,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric',
            'stock' => 'sometimes|required|integer',
            'category_id' => 'sometimes|required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('articles', 'public');
            $validated['image'] = $path;
        }

        $article->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Article mis à jour avec succès.',
            'article' => $article
        ]);
    }

    /**
     * Remove the specified article from storage.
     */
    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();
        return response()->json([
            'success' => true,
            'message' => 'Article supprimé avec succès.',
        ], Response::HTTP_NO_CONTENT);
    }
}