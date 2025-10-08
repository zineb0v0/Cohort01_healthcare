<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $subject = "New Contact Message from {$validated['name']}";

        Mail::send('emails.contact', [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'messageContent' => $validated['message'],
        ], function ($message) use ($validated, $subject) {
            $message->to('your_email@gmail.com') // your Gmail
                    ->subject($subject)
                    ->from('hibaelorfi127@gmail.com', 'Hiba Mailer') // your Gmail
                    ->replyTo($validated['email'], $validated['name']); // user email
        });

        return response()->json(['message' => 'Message sent successfully']);
    }
}
