<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $status;

    /**
     * Create a new message instance.
     */
    public function __construct(Appointment $appointment, $status)
    {
        // Ensure relationships are loaded
        $this->appointment = $appointment->load(['patient.user.profile', 'collaborator.user.profile']);
        $this->status = $status;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $appointmentDate = $this->appointment->date ? \Carbon\Carbon::parse($this->appointment->date)->format('M j, Y') : 'TBD';
        $appointmentTime = $this->appointment->time ? \Carbon\Carbon::parse($this->appointment->time)->format('g:i A') : 'TBD';

        return new Envelope(
            subject: 'Appointment ' . ucfirst($this->status) . ' - ' . $appointmentDate . ' at ' . $appointmentTime,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-status',
            with: [
                'appointment' => $this->appointment,
                'status' => $this->status,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
