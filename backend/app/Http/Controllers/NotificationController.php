<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Récupérer le patient connecté via la relation user->patient
        $patient = $request->user()->patient;

        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        $notifications = $patient->notifications()
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $this->getTitleFromType($notification->type),
                    'message' => $notification->message,
                    'read' => (bool) $notification->read,
                    'created_at' => $notification->created_at->diffForHumans(),
                    'send_time' => $notification->send_time,
                ];
            });

        return response()->json($notifications);
    }

    public function markAsRead(Request $request, $id): JsonResponse
    {
        $patient = $request->user()->patient;

        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        $notification = $patient->notifications()->findOrFail($id);
        $notification->update(['read' => true]);

        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $patient = $request->user()->patient;

        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        $patient->notifications()
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['message' => 'Toutes les notifications marquées comme lues']);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $patient = $request->user()->patient;

        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        $count = $patient->notifications()
            ->where('read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Convert notification type to human readable title
     */
    private function getTitleFromType($type): string
    {
        $titles = [
            'appointment_reminder' => 'Rappel de rendez-vous',
            'appointment_confirmation' => 'Rendez-vous confirmé',
            'appointment_cancellation' => 'Rendez-vous annulé',
            'medical_reminder' => 'Rappel médical',
            'prescription_ready' => 'Ordonnance prête',
            'test_result' => 'Résultat d\'analyse',
            'general' => 'Information importante',
        ];

        return $titles[$type] ?? 'Notification';
    }
}
