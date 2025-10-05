<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\API\MedicationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalysisController;
use App\Http\Controllers\CollaboratorController;

Route::post('/analyses', [AnalysisController::class, 'store']);
Route::get('/analyses', [AnalysisController::class, 'index']);
Route::delete('/analyses/{id}', [AnalysisController::class, 'destroy']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']); //done
Route::post('/login', [AuthController::class, 'login'])->name('login'); //done

// Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']); // done
    Route::put('/me', [AuthController::class, 'updateProfile']);

    Route::post('/logout', action: [AuthController::class, 'logout']);

    // Exemple : route protégée pour voir un profil
    Route::get('/profile', function () {
        return auth()->user()->profile;
    });

    // Custom collaborator routes
    Route::get('/collaborator/appointments', [CollaboratorController::class, 'getCollaboratorAppointments']);
    Route::get('/collaborator/patients', [CollaboratorController::class, 'getCollaboratorPatients']);
    Route::post('/collaborator/appointments/{appointmentId}/confirm', [CollaboratorController::class, 'confirmAppointment']);
    Route::post('/collaborator/appointments/{appointmentId}/cancel', [CollaboratorController::class, 'cancelAppointment']);
    Route::put('/collaborator/appointments/{appointmentId}', [CollaboratorController::class, 'updateAppointment']);
    Route::get('/collaborator/profile', [CollaboratorController::class, 'getCollaboratorProfile']);
    Route::put('/collaborator/profile', [CollaboratorController::class, 'updateCollaboratorProfile']);

    Route::get('/patient/dashboard', [PatientController::class, 'dashboard']);

    // CRUD medications
    Route::get('/patient/medications', [MedicationController::class, 'index']);
    Route::post('/patient/medications', [MedicationController::class, 'store']);
    Route::put('/patient/medications/{id}', [MedicationController::class, 'update']);
    Route::delete('/patient/medications/{id}', [MedicationController::class, 'destroy']);
});

