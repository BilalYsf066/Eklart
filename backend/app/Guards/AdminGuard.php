<?php

namespace App\Guards;

use Illuminate\Auth\SessionGuard;
use Illuminate\Contracts\Auth\Authenticatable;
use App\Models\User;

class AdminGuard extends SessionGuard
{
    public function authenticate(): ?Authenticatable
    {
        $user = parent::authenticate();

        if ($user && $user->role === User::ROLE_ADMIN) {
            return $user;
        }

        return null;
    }
}
