<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Allow all origins or specify the allowed origin
        $allowedOrigins = ['http://localhost:5173']; // Example for React/Vite front-end

        // If you're using the "*" wildcard (not recommended for production)
        // $allowedOrigins = ['*'];

        if (in_array($request->header('Origin'), $allowedOrigins)) {
            header('Access-Control-Allow-Origin: ' . $request->header('Origin'));
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization');
        }

        // Handle preflight requests
        if ($request->getMethod() == "OPTIONS") {
            return response()->json('OK', 200);
        }

        return $next($request);
    }
}
