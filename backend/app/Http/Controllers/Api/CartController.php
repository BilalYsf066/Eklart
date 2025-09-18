<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Auth::user()->cartItems()->with(['article.images', 'article.artisan.user'])->get();

        $formattedItems = $cartItems->map(function ($cartItem) {
            if (!$cartItem->article) {
                return null;
            }
            return [
                'id' => $cartItem->article->id,
                'title' => $cartItem->article->name,
                'price' => (float)$cartItem->article->price,
                'imageUrl' => $cartItem->article->images->first()->image_path ?? null,
                'quantity' => $cartItem->quantity,
                'artisan' => $cartItem->article->artisan->user->full_name,
            ];
        })->filter();

        return response()->json($formattedItems);
    }

    public function store(Request $request)
    {
        $request->validate([
            'article_id' => 'required|exists:articles,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::where('user_id', Auth::id())
            ->where('article_id', $request->article_id)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'user_id' => Auth::id(),
                'article_id' => $request->article_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Article ajouté au panier.', 'cartItem' => $cartItem], 201);
    }

    public function update(Request $request, Article $article)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        CartItem::where('user_id', Auth::id())
            ->where('article_id', $article->id)
            ->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Quantité mise à jour.']);
    }

    public function destroy(Article $article)
    {
        CartItem::where('user_id', Auth::id())
            ->where('article_id', $article->id)
            ->delete();

        return response()->json(['message' => 'Article retiré du panier.']);
    }
    
    public function clear()
    {
        Auth::user()->cartItems()->delete();
        return response()->json(['message' => 'Le panier a été vidé.']);
    }

    public function merge(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:articles,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        DB::transaction(function () use ($request, $user) {
            foreach ($request->items as $localItem) {
                $cartItem = CartItem::where('user_id', $user->id)
                    ->where('article_id', $localItem['id'])
                    ->first();

                if ($cartItem) {
                    $cartItem->quantity += $localItem['quantity'];
                    $cartItem->save();
                } else {
                    $user->cartItems()->create([
                        'article_id' => $localItem['id'],
                        'quantity' => $localItem['quantity'],
                    ]);
                }
            }
        });

        return $this->index();
    }
}