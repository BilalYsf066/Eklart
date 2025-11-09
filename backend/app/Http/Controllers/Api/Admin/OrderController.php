<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

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

    public function generateInvoiceAdmin($orderId)
    {
        // $artisan = Auth::user()->artisan;

        // $order = Order::with(['client.user', 'orderLines.article.artisan'])
        //     ->whereHas('orderLines.article', function ($query) use ($artisan) {
        //         $query->where('artisan_id', $artisan->id);
        //     })
        //     ->findOrFail($orderId);

        $order = Order::with(['client.user', 'orderLines.article.artisan'])
        ->findOrFail($orderId);

        $artisan = $order->orderLines->first()->article->artisan ?? null;

        // Filtrer les lignes de commande appartenant à l’artisan
        $artisanOrderLines = $order->orderLines->filter(function ($line) use ($artisan) {
            return $line->article->artisan_id === $artisan->id;
        });

        $artisanTotal = $artisanOrderLines->sum(function ($line) {
            return $line->price * $line->quantity;
        });

        // Générer le PDF depuis une vue Blade
        $pdf = Pdf::loadView('invoices.order', [
            'order' => $order,
            'artisan' => $artisan,
            'artisanOrderLines' => $artisanOrderLines,
            'artisanTotal' => $artisanTotal,
        ]);

        $fileName = 'facture_' . $order->order_number . '.pdf';

        return $pdf->download($fileName);
    }
}
