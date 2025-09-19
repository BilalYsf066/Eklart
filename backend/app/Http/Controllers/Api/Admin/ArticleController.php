<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    public function index(): JsonResponse
    {
        $articles = Article::with('artisan.user', 'category')->latest()->get()->map(function ($article) {
            return [
                'id' => $article->id,
                'name' => $article->name,
                'price' => $article->price,
                'quantity' => $article->stock,
                'artisan' => $article->artisan->user->full_name,
                'addedAt' => $article->created_at->toIso8601String(),
                'imageUrl' => $article->images->first()->image_path ?? null,
                'visible' => $article->status === 'published',
                'category' => $article->category->name,
            ];
        });
        return response()->json($articles);
    }

    public function toggleVisibility(Article $article): JsonResponse
    {
        $article->status = $article->status === 'published' ? 'draft' : 'published';
        $article->published_at = $article->status === 'published' ? now() : null;
        $article->save();
        
        return response()->json(['message' => 'Article visibility updated.', 'visible' => $article->status === 'published']);
    }

    public function destroy(Article $article): JsonResponse
    {
        $article->delete();
        return response()->json(null, 204);
    }
}