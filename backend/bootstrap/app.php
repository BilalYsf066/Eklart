<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\AdminMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //$middleware->statefulApi();
        //$middleware->alias(['admin' => AdminMiddleware::class]); // <- en cas d'erreur Target class does not exist
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
