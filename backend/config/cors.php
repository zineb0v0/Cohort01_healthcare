<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['sanctum/csrf-cookie', 'api/*'],  // Allow Sanctum CSRF cookie and API routes

    'allowed_methods' => [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'OPTIONS',
    ],
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),  // React front-end
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*', 'Authorization','Content-Type'],  // Allow necessary headers

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,  // Allow sending cookies with requests (important for Sanctum)
];
