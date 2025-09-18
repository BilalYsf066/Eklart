<?php

namespace App\Http\Controllers\Api\Artisan;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderLine;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        $artisan = Auth::user()->artisan;
        if (!$artisan) {
            return response()->json(['message' => 'Artisan non trouvé.'], 404);
        }
        $artisanId = $artisan->id;

        // 1. Montant total des ventes (commandes payées ou livrées)
        $totalSales = OrderLine::whereHas('article', function ($query) use ($artisanId) {
            $query->where('artisan_id', $artisanId);
        })->whereHas('order', function ($query) {
            $query->whereIn('status', ['livré', 'payée']);
        })->sum(DB::raw('order_lines.price * order_lines.quantity'));

        // 2. Nombre total de commandes
        $totalOrders = Order::whereHas('orderLines.article', function ($query) use ($artisanId) {
            $query->where('artisan_id', $artisanId);
        })->distinct()->count('orders.id');

        // 3. Nombre total d'étoiles
        $totalStars = Review::whereHas('article', function ($query) use ($artisanId) {
            $query->where('artisan_id', $artisanId);
        })->sum('rating');

        return response()->json([
            'totalSales' => (float) $totalSales,
            'totalOrders' => (int) $totalOrders,
            'totalStars' => (int) $totalStars,
            'viewsThisMonth' => 427, // Statique pour l'instant
        ]);
    }
}