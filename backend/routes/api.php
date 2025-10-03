<?php

use App\Http\Controllers\API\Auth\AuthController;
use App\Http\Controllers\API\Auth\ForgotPasswordController;
use App\Http\Controllers\API\CollaboratorController;
use App\Http\Controllers\API\MedicationController;
use App\Http\Controllers\API\MedicationIntakeController;
use App\Http\Controllers\API\PatientController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------|
| API Routes                                                              |
|--------------------------------------------------------------------------|
*/

// Route::get('/sanctum/csrf-cookie', function () {
//     return response()->json(['message' => 'CSRF cookie set']);
// });

// Public routes
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Forgot Password routes
Route::post('forgotPassword', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('reset-password/{token}/{email}', [ForgotPasswordController::class, 'showResetForm'])->name('password.reset');

Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword'])->name('password.update');

// Routes that require Sanctum authentication
Route::middleware('auth:sanctum')->group(function () {
    // Authenticated User Routes
    Route::get('/user', function () {
        return response()->json(auth()->user()); // Return the authenticated user's data
    });

    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    // Route::get('email/verify', [EmailVerificationController::class,'notice'])->name('verification.notice');
    // Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify')->middleware(['signed']);
    // Route::post('/email/verification-notification',[EmailVerificationController::class,'send'])->name('verification.send')->middleware(['throttle:6,1']);

    Route::get('/profile', function () {
        return auth()->user()->profile;
    });

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
    Route::middleware(['auth:sanctum', 'role:Collaborateur'])->get('/collaborator/dashboard', [CollaboratorController::class, 'index']);
    // Protected Routes for Patient
    Route::prefix('patient')->middleware(['auth:sanctum', 'role:Patient'])->group(function () {
        // Dashboard and CRUD for medications
        Route::get('/dashboard', [PatientController::class, 'dashboard']);
        Route::get('/medications', [MedicationController::class, 'index']);
        Route::post('/medications', [MedicationController::class, 'store']);
        Route::put('/medications/{id}', [MedicationController::class, 'update']);
        Route::delete('/medications/{id}', [MedicationController::class, 'destroy']);
        Route::put('/medication-intakes/{id}/status', [MedicationIntakeController::class, 'updateStatus']);
    });
});
