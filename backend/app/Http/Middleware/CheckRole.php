<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next, $role)
    {
        // Use the 'api' guard (Sanctum) explicitly
        $user = Auth::guard('api')->user(); // for sanctum athentication

        if (!$user) {
            // Not authenticated
            return response()->json([
                'message' => 'non authentifié.',
            ], 401);
        }

        // Using Spatie roles to check (for authorization)
        if (!$user->hasRole($role)) {
            // Authenticated but role is wrong
            return response()->json([
                'message' => 'role non autorisé',
            ], 403);
        }

        // Everything is okay, we continue and passe the request to it specified controller action
        return $next($request);
    }
}
