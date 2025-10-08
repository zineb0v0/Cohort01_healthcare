<?php

namespace App\Http\Controllers;

use App\Models\NewsletterEmail;
use Illuminate\Http\Request;

class NeswletterEmailController extends Controller
{
    // Store email
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletter_emails,email',
        ]);

        $newsletter = NewsletterEmail::create([
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Email enregistré avec succès !',
            'data' => $newsletter,
        ], 201);
    }

    // Get all emails
    public function index()
    {
        $emails = NewsletterEmail::all();

        return response()->json($emails);
    }

    // Delete an email
    public function destroy($id)
    {
        $newsletter = NewsletterEmail::findOrFail($id);
        $newsletter->delete();

        return response()->json([
            'message' => 'Email supprimé en succès!',
        ]);
    }
}
