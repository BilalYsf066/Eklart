<?php
// app/Models/Artisan.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artisan extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'PENDING';
    const STATUS_APPROVED = 'APPROVED';
    const STATUS_REJECTED = 'REJECTED';

    protected $fillable = [
        'user_id',
        'shop_name',
        'description',
        'identity_document_path',
        'validation_status',
        'validated_at',
        'validated_by',
        'rejection_reason',
    ];

    protected $casts = [
        'validated_at' => 'datetime',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    // Méthodes utilitaires
    public function isApproved(): bool
    {
        return $this->validation_status === self::STATUS_APPROVED;
    }

    public function isPending(): bool
    {
        return $this->validation_status === self::STATUS_PENDING;
    }

    public function isRejected(): bool
    {
        return $this->validation_status === self::STATUS_REJECTED;
    }
}