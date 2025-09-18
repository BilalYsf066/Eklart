<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class ArticleController extends Controller
{
    //
    /**
    * Display a listing of the published articles.
    */
    public function index(): JsonResponse
    {
        $articles = Article::where('status', 'published')->with([
            'images', 'category', 'artisan.user'
        ])->latest('published_at')->get()->map(function ($article) {
            return [
                'id' => $article->id,
                'title' => $article->name,
                'price' => $article->price,
                'imageUrl' => $article->images->first()->image_path ?? null, // Safely get the first image
                'artisan' => $article->artisan->user->full_name,
                'category' => $article->category->name,
                'is_new' => $article->published_at && $article->published_at->gt(Carbon::now()->subDays(7)),
            ];
        });
        return response()->json($articles);
    }

    /**
     * Display the specified published article.
     */
    public function show(Article $article): JsonResponse
    {
        // On s'assure que l'article est publié avant de le retourner
        if ($article->status !== 'published') {
            return response()->json(['message' => 'Article non trouvé.'], 404);
        }

        // On charge les relations nécessaires
        $article->load(['images', 'category', 'artisan.user', 'reviews.client.user']);

        // On formate la réponse pour correspondre à ce que le front-end attend
        $formattedArticle = [
            'id' => $article->id,
            'title' => $article->name,
            'price' => (float) $article->price,
            'description' => $article->description,
            'images' => $article->images->pluck('image_path'),
            'artisan' => $article->artisan->user->full_name,
            'artisanProfile' => '/artisans/' . $article->artisan->id,
            'category' => $article->category->name,
            'materials' => $article->materials,
            'dimensions' => $article->dimensions,
            'weight' => $article->weight,
            'inStock' => $article->stock,
            'isNew' => $article->published_at && $article->published_at->gt(Carbon::now()->subDays(7)),
            'rating' => round($article->reviews->avg('rating'), 1) ?? 0,
            'reviewsCount' => $article->reviews->count(),
            'reviews' => $article->reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'date' => $review->created_at->toIso8601String(),
                    'clientName' => $review->client->user->full_name ?? 'Anonyme',
                ];
            }),
            'shipping' => "2-5 jours ouvrables",
            'returnPolicy' => "Retours acceptés sous 14 jours"
        ];
    
        return response()->json($formattedArticle);
    }
}
