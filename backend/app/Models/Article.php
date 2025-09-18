<?php

namespace App\Models;

use App\Models\ArticleImage;
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
        'artisan_id',
        'status',
        'published_at',
        'materials',
        'dimensions',
        'weight',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'materials' => 'array',
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

    public function images()
    {
        return $this->hasMany(ArticleImage::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}