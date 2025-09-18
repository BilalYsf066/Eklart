<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request, Article $article)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10',
        ]);

        $user = Auth::user();

        // Check if the user has a client profile, create if not
        $client = $user->client()->firstOrCreate(
            ['user_id' => $user->id],
            ['address' => 'Non défini', 'city' => 'Non défini']
        );

        // Check if the user has already reviewed this article
        $existingReview = Review::where('client_id', $client->id)
            ->where('article_id', $article->id)
            ->exists();

        if ($existingReview) {
            return response()->json(['message' => 'Vous avez déjà évalué cet article.'], 409);
        }

        $review = Review::create([
            'client_id' => $client->id,
            'article_id' => $article->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);
        
        $review->load('client.user');
        
        $formattedReview = [
            'id' => $review->id,
            'rating' => $review->rating,
            'comment' => $review->comment,
            'date' => $review->created_at->toIso8601String(),
            'clientName' => $review->client->user->full_name,
        ];

        return response()->json($formattedReview, 201);
    }
}