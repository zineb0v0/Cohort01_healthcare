<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomResetPasswordNotification extends Notification
{
    use Queueable;

    public $token;
    public $email;

    public function __construct($token, $email)
    {
        $this->token = $token;  // Store the token for later use
        $this->email = $email;  // Store the email for later use
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        // Build the frontend URL
        $frontendUrl = config('app.frontend_url')
            .'/reset-password?token='
            .$this->token
            .'&email='
            .urlencode($this->email);

        return (new MailMessage())
            ->subject('Password Reset Request')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $frontendUrl)
            ->line('If you did not request a password reset, no further action is required.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            // You can include other notification data here
        ];
    }
}
