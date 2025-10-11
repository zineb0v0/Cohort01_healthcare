<?php

use App\Http\Controllers\AnalysisController;
use App\Http\Controllers\API\Auth\AuthController;
use App\Http\Controllers\API\Auth\ForgotPasswordController;
use App\Http\Controllers\API\CollaboratorController;
use App\Http\Controllers\API\MedicationController;
use App\Http\Controllers\API\MedicationIntakeController;
use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NeswletterEmailController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------|
| API Routes                                                              |
|--------------------------------------------------------------------------|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Forgot Password routes
Route::post('forgotPassword', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('reset-password/{token}/{email}', [ForgotPasswordController::class, 'showResetForm'])->name('password.reset');

Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword'])->name('password.update');
// Send mail
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');
Route::post('/newsletter', [NeswletterEmailController::class, 'store']);
Route::get('/newsletter', [NeswletterEmailController::class, 'index']);
Route::delete('/newsletter/{id}', [NeswletterEmailController::class, 'destroy']);
// analyses routes
Route::post('/analyses', [AnalysisController::class, 'store']);
Route::get('/analyses', [AnalysisController::class, 'index']);
Route::delete('/analyses/{id}', [AnalysisController::class, 'destroy']);

// Routes that require Sanctum authentication
Route::middleware('auth:sanctum')->group(function () {
    // Authenticated User Routes
    Route::get('/user', function () {
        $user = auth()->user()->load(['profile', 'patient', 'collaborator']); // Eager load relations
        $user->role = $user->getRoleNames()->first(); // Add the role as a property

        return response()->json($user);
    });

    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    // Route::get('email/verify', [EmailVerificationController::class,'notice'])->name('verification.notice');
    // Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify')->middleware(['signed']);
    // Route::post('/email/verification-notification',[EmailVerificationController::class,'send'])->name('verification.send')->middleware(['throttle:6,1']);

    // Exemple : route protégée pour voir un profil
    // Route::get('/profile', function () {
    // $profile = auth()->user()->profile;
    // return [
    //     'id' => $profile->id,
    //     'first_name' => $profile->first_name,
    //     'last_name' => $profile->last_name,
    //     'phone' => $profile->phone,
    //     'address' => $profile->address,
    //     'date_birth' => $profile->date_birth,
    //     'gender' => $profile->gender,
    //     'emergency_contact' => $profile->emergency_contact,
    //     'email' => auth()->user()->email,
    // ];
    // });

    Route::middleware('role:Collaborateur')->get('/collaborator/dashboard', [CollaboratorController::class, 'index']);
    // Protected Routes for Collaborator
    // Route::prefix('collaborator')->group(function () {
    //     Route::get('/appointments', [CollaboratorController::class, 'getCollaboratorAppointments']);
    //     Route::get('/patients', [CollaboratorController::class, 'getCollaboratorPatients']);
    //     Route::post('/appointments/{appointmentId}/confirm', [CollaboratorController::class, 'confirmAppointment']);
    //     Route::post('/appointments/{appointmentId}/cancel', [CollaboratorController::class, 'cancelAppointment']);
    //     Route::put('/appointments/{appointmentId}', [CollaboratorController::class, 'updateAppointment']);
    //     Route::get('/profile', [CollaboratorController::class, 'getCollaboratorProfile']);
    //     Route::put('/profile', [CollaboratorController::class, 'updateCollaboratorProfile']);
    // });
    // Protected Routes for Patient
    Route::prefix('patient')->middleware('role:Patient')->group(function () {
        // Dashboard and CRUD for medications
        Route::get('/dashboard', [PatientController::class, 'dashboard']);
        // Route::get('/medications', [MedicationController::class, 'index']);
        // Route::post('/medications', [MedicationController::class, 'store']);
        // Route::put('/medications/{id}', [MedicationController::class, 'update']);
        // Route::delete('/medications/{id}', [MedicationController::class, 'destroy']);
        // Route::put('/medication-intakes/{id}/status', [MedicationIntakeController::class, 'updateStatus']);
    });

    // Dashboard du patient
    // Route::get('/patient/dashboard', [PatientController::class, 'dashboard']);
    Route::get('/patient/account-activity', [ProfileController::class, 'accountActivity']);

    // CRUD medications
    Route::get('/patient/medications', [MedicationController::class, 'index']);
    Route::post('/patient/medications', [MedicationController::class, 'store']);
    Route::put('/patient/medications/{id}', [MedicationController::class, 'update']);
    Route::delete('/patient/medications/{id}', [MedicationController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->put('/profile', function () {
    $profile = auth()->user()->profile;

    request()->validate([
        'first_name' => 'string|max:255',
        'last_name' => 'string|max:255',
        'phone' => 'string|max:20',
        'address' => 'string|max:255',
        'date_birth' => 'date',
        'gender' => 'in:male,female,other',
        'emergency_contact' => 'nullable|string|max:20',
    ]);

    $profile->update(request()->only([
        'first_name',
        'last_name',
        'phone',
        'address',
        'date_birth',
        'gender',
        'emergency_contact',
    ]));

    return response()->json($profile);
});
