<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Article;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->configurePermissions();
    }

    protected function configurePermissions(): void
    {
        Gate::define('manage', function (User $user, Article $article) {
            $artisanId = optional($user->artisan)->id;
            return ($artisanId && $artisanId === $article->artisan_id);
        });
    }
}
