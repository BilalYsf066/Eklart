<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = Order::with('client.user')->latest()->get()->map(function ($order) {
            return [
                'id' => $order->id,
                'date' => $order->order_date->toIso8601String(),
                'orderNumber' => $order->order_number,
                'customerName' => $order->client->user->full_name,
                'method' => $order->payment_method,
                'amount' => $order->total_amount,
                'status' => $order->status,
            ];
        });
        return response()->json($orders);
    }
}
