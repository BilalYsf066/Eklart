<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Admin;

class Category extends Model
{
    //
    protected $fillable = [
        'name',
        'admin_id',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function articles()
    {
        return $this->hasMany(Article::class);
    }
}
