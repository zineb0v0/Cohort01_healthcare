<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, \Closure $next, $role)
    {
        if (!Auth::check()) {
            // Si l'utilisateur n'est pas connecté
            return redirect('/authentication')->with('error', 'Veuillez vous connecter pour accéder à cette page.');
        }

        if (Auth::user()->role !== $role) {
            // Si l'utilisateur n'a pas le bon rôle, redirection vers accueil
            return redirect('/')->with('error', 'Accès refusé.');
        }

        // passer la requête
        return $next($request);
    }
}
