<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AnalysisController;
use App\Http\Controllers\MedicationController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\CollaboratorController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\NewsletterEmailController;
use App\Http\Controllers\MedicationIntakeController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Route::get('/test', function () {
//     return response()->json(['message' => 'API is working!']);
// });
// Route::post('/test-post', function (Request $request) {
//     return response()->json([
//         'message' => 'POST is working!',
//         'data_received' => $request->all(),
//     ]);
// });
// Password Reset
Route::post('forgotPassword', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('reset-password/{token}/{email}', [ForgotPasswordController::class, 'showResetForm'])->name('password.reset');

Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword'])->name('password.update');

// Contact & Newsletter
Route::post('/contact', [ContactController::class, 'send']);
Route::post('/newsletter', [NewsletterEmailController::class, 'store']);
Route::get('/newsletter', [NewsletterEmailController::class, 'index']);
Route::delete('/newsletter/{id}', [NewsletterEmailController::class, 'destroy']);

// Analyses (consider making these authenticated or adding auth where needed)
Route::apiResource('/analyses', AnalysisController::class);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function () {
        $user = auth()->user()->load(['profile', 'patient', 'collaborator']);
        $user->role = $user->getRoleNames()->first();

        return response()->json($user);
    });

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    // Exemple : route protégée pour voir un profil
    Route::get('/profile', function () {
        $user = auth()->user();
        $profile = $user->profile;

        if ($user->patient) {
            $userType = 'patient';
        } elseif ($user->collaborator) {
            $userType = 'collaborator';
        } else {
            $userType = 'unknown';
        }

        return [
            'id' => $profile->id,
            'first_name' => $profile->first_name,
            'last_name' => $profile->last_name,
            'phone' => $profile->phone,
            'address' => $profile->address,
            'date_birth' => $profile->date_birth,
            'gender' => $profile->gender,
            'emergency_contact' => $profile->emergency_contact,
            'email' => auth()->user()->email,
            'user_type' => $userType,
        ];
    });

    // Collaborator Routes
    Route::middleware('role:Collaborateur')->prefix('collaborator')->group(function () {
        Route::get('/dashboard', [CollaboratorController::class, 'index']);
        Route::get('/appointments', [CollaboratorController::class, 'getCollaboratorAppointments']);
        Route::get('/patients', [CollaboratorController::class, 'getCollaboratorPatients']);
        Route::post('/appointments/{appointmentId}/confirm', [CollaboratorController::class, 'confirmAppointment']);
        Route::post('/appointments/{appointmentId}/cancel', [CollaboratorController::class, 'cancelAppointment']);
        Route::put('/appointments/{appointmentId}', [CollaboratorController::class, 'updateAppointment']);
        Route::get('/profile', [CollaboratorController::class, 'getCollaboratorProfile']);
        Route::put('/profile', [CollaboratorController::class, 'updateCollaboratorProfile']);
    });
    Route::middleware('role:Patient')->group(function () {
        Route::get('/collaborators/available', [CollaboratorController::class, 'getAvailableCollaborators']);
        Route::post('/appointments', [AppointmentController::class, 'createAppointment']);
    });
    // Patient Routes
    Route::middleware('role:Patient')->prefix('patient')->group(function () {
        Route::get('/dashboard', [PatientController::class, 'dashboard']);
        Route::get('/account-activity', [ProfileController::class, 'accountActivity']);
        Route::get('/appointments', [PatientController::class, 'listAppointments']);

        // Medications
        Route::apiResource('/medications', MedicationController::class);

        // Medication Intakes
        Route::get('/medication-intakes/percentages', [MedicationIntakeController::class, 'percentages']);
        Route::put('/medication-intakes/{id}/status', [MedicationIntakeController::class, 'updateStatus']);
    });
});
Route::middleware('auth:sanctum')->put('/profile', function () {
    $profile = auth()->user()->profile;
    $user = auth()->user();

    request()->validate([
        'first_name' => 'string|max:255',
        'last_name' => 'string|max:255',
        'email' => 'required|email|max:255|unique:users,email,'.$user->id,
        'phone' => 'string|max:20',
        'address' => 'string|max:255',
        'date_birth' => 'date',
        'gender' => 'in:homme,femme',
        'emergency_contact' => 'nullable|string|max:20',
    ]);

    // Update profile fields
    $profile->update(request()->only([
        'first_name',
        'last_name',
        'phone',
        'address',
        'date_birth',
        'gender',
        'emergency_contact',
    ]));

    // Update email in users table
    $user->update(['email' => request('email')]);

    return response()->json([
        'first_name' => $profile->first_name,
        'last_name' => $profile->last_name,
        'phone' => $profile->phone,
        'address' => $profile->address,
        'date_birth' => $profile->date_birth,
        'gender' => $profile->gender,
        'emergency_contact' => $profile->emergency_contact,
        'email' => $user->email,
    ]);
});
