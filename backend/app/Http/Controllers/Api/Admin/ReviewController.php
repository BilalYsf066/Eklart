<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function index(): JsonResponse
    {
        $reviews = Review::with('client.user')->latest()->get()->map(function ($review) {
            return [
                'id' => $review->id,
                'clientName' => $review->client->user->full_name,
                'comment' => $review->comment,
                'date' => $review->created_at->toIso8601String(),
                'visible' => $review->visible,
            ];
        });
        return response()->json($reviews);
    }

    public function toggleVisibility(Review $review): JsonResponse
    {
        $review->visible = !$review->visible;
        $review->save();

        return response()->json(['message' => 'Review visibility updated.', 'visible' => $review->visible]);
    }

    public function destroy(Review $review): JsonResponse
    {
        $review->delete();
        return response()->json(null, 204);
    }
}