<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CollaboratorController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
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
});
