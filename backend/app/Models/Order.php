<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //
    protected $fillable = [
        'client_id',
        'order_number',
        'order_date',
        'total_amount',
        'payment_method',
        'status',
    ];

    protected $casts = [
        'order_date' => 'datetime',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function orderLines()
    {
        return $this->hasMany(OrderLine::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
