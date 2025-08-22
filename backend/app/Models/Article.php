<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    //
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'category_id',
    ];

    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderLines()
    {
        return $this->hasMany(OrderLine::class);
    }
}
