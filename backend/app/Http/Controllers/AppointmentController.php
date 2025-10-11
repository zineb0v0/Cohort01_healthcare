<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Collaborator;
use App\Models\Patient;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    /**
     * PATIENT SIDE METHODS.
     */

    /**
     * Book a new appointment (Patient)
     * POST /api/appointments.
     */
    public function store(Request $request)
    {
        $request->validate([
            'collaborator_id' => 'required|exists:collaborators,id',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'nullable|date_format:H:i:s',
            'type' => 'nullable|string|max:255',
            'is_telehealth' => 'boolean',
            'telehealthLink' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Get the patient record for the authenticated user
        $patient = Auth::user()->patient;

        if (!$patient) {
            return response()->json([
                'message' => 'Patient profile not found',
            ], 404);
        }

        // Check if collaborator exists
        $collaborator = Collaborator::find($request->collaborator_id);
        if (!$collaborator) {
            return response()->json([
                'message' => 'Collaborator not found',
            ], 404);
        }

        // Validate date and time combination is in the future
        $appointmentDate = Carbon::parse($request->date);
        if ($request->time) {
            $appointmentDateTime = $appointmentDate->setTimeFromTimeString($request->time);
            if ($appointmentDateTime->isPast()) {
                return response()->json([
                    'message' => 'Appointment date and time must be in the future',
                ], 422);
            }
        }

        try {
            DB::beginTransaction();

            $appointment = Appointment::create([
                'patient_id' => $patient->id,
                'collaborator_id' => $request->collaborator_id,
                'date' => $appointmentDate,
                'time' => $request->time,
                'type' => $request->type,
                'is_telehealth' => $request->boolean('is_telehealth', false),
                'telehealthLink' => $request->telehealthLink,
                'notes' => $request->notes,
                'status' => 'pending', // Using string instead of constant
            ]);

            // Load relationships for response
            $appointment->load(['patient.user', 'collaborator.user']);

            DB::commit();

            return response()->json([
                'message' => 'Appointment booked successfully',
                'appointment' => $appointment,
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'message' => 'Failed to book appointment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List patient appointments
     * GET /api/appointments.
     */
    public function index(Request $request)
    {
        $patient = Auth::user()->patient;

        if (!$patient) {
            return response()->json([
                'message' => 'Patient profile not found',
            ], 404);
        }

        $query = $patient->appointments()->with(['collaborator.user']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range if provided
        if ($request->has('from_date')) {
            $query->where('date', '>=', Carbon::parse($request->from_date));
        }

        if ($request->has('to_date')) {
            $query->where('date', '<=', Carbon::parse($request->to_date));
        }

        $appointments = $query->orderBy('date', 'desc')->paginate(10);

        return response()->json([
            'appointments' => $appointments,
        ]);
    }

    /**
     * Cancel appointment (Patient)
     * DELETE /api/appointments/{id}.
     */
    public function destroy($id)
    {
        $patient = Auth::user()->patient;

        if (!$patient) {
            return response()->json([
                'message' => 'Patient profile not found',
            ], 404);
        }

        $appointment = $patient->appointments()->find($id);

        if (!$appointment) {
            return response()->json([
                'message' => 'Appointment not found',
            ], 404);
        }

        if (!$appointment->canBeCancelled()) {
            return response()->json([
                'message' => 'This appointment cannot be cancelled',
            ], 400);
        }

        try {
            $appointment->update(['status' => Appointment::STATUS_CANCELLED]);

            return response()->json([
                'message' => 'Appointment cancelled successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to cancel appointment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * COLLABORATOR SIDE METHODS.
     */

    /**
     * List pending appointment requests (Collaborator)
     * GET /api/appointments/pending.
     */
    public function pending(Request $request)
    {
        $collaborator = Auth::user()->collaborator;

        if (!$collaborator) {
            return response()->json([
                'message' => 'Collaborator profile not found',
            ], 404);
        }

        $pendingAppointments = $collaborator->appointments()
            ->pending()
            ->with(['patient.user'])
            ->orderBy('datetime', 'asc')
            ->paginate(10);

        return response()->json([
            'pending_appointments' => $pendingAppointments,
        ]);
    }

    /**
     * Accept appointment request (Collaborator)
     * POST /api/appointments/{id}/accept.
     */
    public function accept($id)
    {
        return $this->updateAppointmentStatus($id, Appointment::STATUS_CONFIRMED, 'accepted');
    }

    /**
     * Reject appointment request (Collaborator)
     * POST /api/appointments/{id}/reject.
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'rejection_reason' => 'nullable|string|max:500',
        ]);

        return $this->updateAppointmentStatus(
            $id,
            Appointment::STATUS_REJECTED,
            'rejected',
            $request->rejection_reason
        );
    }

    /**
     * Helper method to update appointment status.
     */
    private function updateAppointmentStatus($id, $status, $action, $notes = null)
    {
        $collaborator = Auth::user()->collaborator;

        if (!$collaborator) {
            return response()->json([
                'message' => 'Collaborator profile not found',
            ], 404);
        }

        $appointment = $collaborator->appointments()->find($id);

        if (!$appointment) {
            return response()->json([
                'message' => 'Appointment not found',
            ], 404);
        }

        if (!$appointment->isPending()) {
            return response()->json([
                'message' => 'Only pending appointments can be '.$action,
            ], 400);
        }

        try {
            $updateData = ['status' => $status];

            if ($notes) {
                $updateData['notes'] = $appointment->notes ?
                    $appointment->notes."\n\nRejection reason: ".$notes :
                    'Rejection reason: '.$notes;
            }

            $appointment->update($updateData);

            $appointment->load(['patient.user']);

            return response()->json([
                'message' => 'Appointment '.$action.' successfully',
                'appointment' => $appointment,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to '.$action.' appointment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List all appointments for collaborator
     * GET /api/collaborator/appointments.
     */
    public function collaboratorAppointments(Request $request)
    {
        $collaborator = Auth::user()->collaborator;

        if (!$collaborator) {
            return response()->json([
                'message' => 'Collaborator profile not found',
            ], 404);
        }

        $query = $collaborator->appointments()->with(['patient.user']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $appointments = $query->orderBy('datetime', 'asc')->paginate(10);

        return response()->json([
            'appointments' => $appointments,
        ]);
    }
}
