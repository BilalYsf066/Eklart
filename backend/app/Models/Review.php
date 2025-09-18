<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    //
    protected $fillable = [
        'client_id',
        'article_id',
        'rating',
        'comment',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
