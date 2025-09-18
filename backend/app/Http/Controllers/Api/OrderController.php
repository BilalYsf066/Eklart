<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Order;
use App\Models\OrderLine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->client) {
            return response()->json([]); // Return empty array if user has no client profile
        }

        $orders = Order::where('client_id', $user->client->id)
            ->with('orderLines.article')
            ->latest()
            ->get();

        $formattedOrders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'date' => $order->order_date->format('d/m/Y'),
                'total' => (float) $order->total_amount,
                'status' => $order->status,
                'items' => $order->orderLines->map(function ($line) {
                    return [
                        'name' => $line->article->name,
                        'quantity' => $line->quantity,
                    ];
                }),
            ];
        });

        return response()->json($formattedOrders);
    }
    
    public function store(Request $request)
    {
        $user = Auth::user();
        $client = $user->client()->firstOrCreate(
            ['user_id' => $user->id],
        );

        $validatedData = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'paymentMethod' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $cartItems = $user->cartItems()->with('article')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Votre panier est vide.'], 400);
        }

        $shippingCost = 2500;
        $order = null;

        try {
            DB::transaction(function () use ($user, $client, $validatedData, $cartItems, $shippingCost, &$order) {
                // Update client's address
                $client->update([
                    'address' => $validatedData['address'],
                    'city' => $validatedData['city'],
                ]);
                
                // Update user's name if changed
                $user->update([
                    'first_name' => $validatedData['firstName'],
                    'last_name' => $validatedData['lastName'],
                ]);

                $totalAmount = $cartItems->sum(function ($cartItem) {
                    return $cartItem->article->price * $cartItem->quantity;
                }) + $shippingCost;

                // Create the order
                $order = Order::create([
                    'client_id' => $client->id,
                    'order_date' => now(),
                    'total_amount' => $totalAmount,
                    'status' => 'en attente',
                    'order_number' => 'CMD-' . strtoupper(Str::random(8)),
                    'payment_method' => $validatedData['paymentMethod'],
                ]);

                // Create order lines and update article stock
                foreach ($cartItems as $cartItem) {
                    $article = $cartItem->article;

                    if ($article->stock < $cartItem->quantity) {
                        throw new \Exception('Stock insuffisant pour l\'article: ' . $article->name);
                    }

                    OrderLine::create([
                        'order_id' => $order->id,
                        'article_id' => $article->id,
                        'quantity' => $cartItem->quantity,
                        'price' => $article->price,
                    ]);

                    $article->decrement('stock', $cartItem->quantity);
                }

                // Clear the user's cart
                $user->cartItems()->delete();
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la création de la commande: ' . $e->getMessage()], 500);
        }

        // Prepare response data
        $order->load('orderLines.article.images');
        $formattedOrder = [
            'orderNumber' => $order->order_number,
            'date' => $order->order_date->locale('fr')->isoFormat('L'),
            'items' => $order->orderLines->map(function ($line) {
                return [
                    'id' => $line->article->id,
                    'name' => $line->article->name,
                    'price' => (float)$line->price,
                    'quantity' => $line->quantity,
                ];
            }),
            'subtotal' => $order->total_amount - $shippingCost,
            'shipping' => $shippingCost,
            'total' => $order->total_amount,
        ];

        return response()->json($formattedOrder, 201);
    }
}