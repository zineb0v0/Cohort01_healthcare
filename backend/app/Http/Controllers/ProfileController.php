<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ProfileController extends Controller
{
    public function accountActivity(Request $request)
    {
        $user = $request->user()->load('patient.appointments'); // récupère les appointments liés

        $data = [
            'member_since' => $user->created_at->format('M Y'),
            'total_appointments' => $user->patient ? $user->patient->appointments->count() : 0,
            'last_login_at' => $user->last_login_at ? $user->last_login_at->format('M d, Y') : null,
        ];

        return response()->json($data);
    }   
}
