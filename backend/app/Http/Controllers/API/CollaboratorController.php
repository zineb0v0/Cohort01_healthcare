<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CollaboratorController extends Controller
{
    public function index()
    {
        // Get the authenticated user
        $user = Auth::user();

        // You can define the data to be returned for the dashboard
        $dashboardData = [
            'message' => 'Welcome to the Collaborator Dashboard!',
            'user' => $user,
        ];

        return response()->json($dashboardData);
    }
}
