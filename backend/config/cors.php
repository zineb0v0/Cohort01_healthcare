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

    'paths' => ['api/*'],  // Allowing the  API routes

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

    'allowed_headers' => ['*'],  // Allow necessary headers

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false, // set to true ONLY if we use cookies
];
