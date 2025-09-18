<?php

namespace App\Http\Controllers\Api\Artisan;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $artisan = Auth::user()->artisan;

        $orders = Order::whereHas('orderLines.article', function ($query) use ($artisan) {
            $query->where('artisan_id', $artisan->id);
        })
        ->with(['client.user', 'orderLines.article'])
        ->latest()
        ->get();
        
        $formattedOrders = $orders->map(function ($order) use ($artisan) {
            $artisanOrderLines = $order->orderLines->filter(function ($line) use ($artisan) {
                return $line->article->artisan_id === $artisan->id;
            });

            $artisanTotal = $artisanOrderLines->sum(function ($line) {
                return $line->price * $line->quantity;
            });

            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'date' => $order->order_date->format('d/m/Y'),
                'customer' => $order->client->user->full_name,
                'items' => $artisanOrderLines->map(function ($line) {
                    return [
                        'id' => $line->article->id,
                        'name' => $line->article->name,
                        'quantity' => $line->quantity,
                    ];
                })->values(),
                'total' => $artisanTotal,
                'status' => $order->status,
            ];
        });

        return response()->json($formattedOrders);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $artisan = Auth::user()->artisan;

        $isArtisanOrder = $order->orderLines()->whereHas('article', function ($query) use ($artisan) {
            $query->where('artisan_id', $artisan->id);
        })->exists();

        if (!$isArtisanOrder) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:en attente,payée,en cours,livré,annulé',
        ]);

        $order->status = $validated['status'];
        
        if ($validated['status'] === 'payée' && !$order->payment) {
            Payment::create([
                'order_id' => $order->id,
                'amount' => $order->total_amount,
                'payment_method' => $order->payment_method,
                'payment_date' => now(),
            ]);
        }
        
        $order->save();

        return response()->json(['message' => 'Statut de la commande mis à jour.', 'order' => $order]);
    }
}