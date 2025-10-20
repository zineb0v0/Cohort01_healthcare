<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\CustomResetPasswordNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255',
        ]);

        // Find the user
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        // Create a password reset token manually
        $token = bin2hex(random_bytes(32));

        // Store the token in the password_reset_tokens table
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'email' => $user->email,
                'token' => $token,
                'created_at' => now(),
            ]
        );

        // Send your custom notification
        $user->notify(new CustomResetPasswordNotification($token, $request->email));

        return response()->json([
            'message' => 'Le lien de réinitialisation a été envoyé avec succès !',
        ]);
    }

    /**
     * Show the password reset form (for API, we just return the token and email).
     */
    /**
     * @param string $token
     * @param string $email
     *
     * @return \Illuminate\View\View
     */
    public function showResetForm($token, $email)
    {
        // Check if the token is valid
        $passwordReset = DB::table('password_reset_tokens')
                            ->where('token', $token)
                            ->where('email', $email)
                            ->first();

        if (!$passwordReset) {
            // Render an error view instead of returning JSON
            return view('auth.reset-password-error', ['message' => 'email ou token invalide']);
        }

        // Render the Blade view with token and email
        return view('auth.reset-password', compact('token', 'email'));
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed', // Password confirmation must match
        ]);

        // Check if the token exists and is valid for the email
        $passwordReset = DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->where('token', $validated['token'])
            ->first();

        if (!$passwordReset) {
            return response()->json(['message' => 'lien invalide ou expiré'], 400);
        }

        // Check if the token has expired (Optional: default expiration is 60 minutes)
        $expiresIn = 60; // Token expiration in minutes
        if (now()->diffInMinutes($passwordReset->created_at) > $expiresIn) {
            return response()->json(['message' => 'lien expiré'], 400);
        }

        // Find the user by email
        $user = User::where('email', $validated['email'])->first();
        if (!$user) {
            return response()->json(['message' => 'utilisateur non trouvé'], 404);
        }

        // Update the user's password
        $user->password = Hash::make($validated['password']);
        $user->save();

        // Delete the reset token (optional)
        DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();
        // Redirect to the success page with a success message

        return view('auth.reset-success', ['message' => 'Mot de passe réinitialisé avec succès !']);
    }
}
