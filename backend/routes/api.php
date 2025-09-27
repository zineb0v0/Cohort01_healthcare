<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\API\MedicationController;
use App\Http\Controllers\API\AppointmentController;
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

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth user info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Patient dashboard
    Route::get('/patient/dashboard', [PatientController::class, 'dashboard']);

    // CRUD Medications (patient side)
    Route::prefix('patient')->group(function () {
        Route::get('/medications', [MedicationController::class, 'index']);
        Route::post('/medications', [MedicationController::class, 'store']);
        Route::put('/medications/{id}', [MedicationController::class, 'update']);
        Route::delete('/medications/{id}', [MedicationController::class, 'destroy']);
    });

    // 📌 APPOINTMENT ROUTES
    Route::prefix('appointments')->group(function () {
        // PATIENT SIDE
        Route::post('/', [AppointmentController::class, 'store']);       // Book appointment
        Route::get('/', [AppointmentController::class, 'index']);        // List patient appointments
        Route::delete('/{id}', [AppointmentController::class, 'destroy']); // Cancel appointment

        // COLLABORATOR SIDE
        Route::get('/pending', [AppointmentController::class, 'pending']);   // List pending requests
        Route::post('/{id}/accept', [AppointmentController::class, 'accept']); // Accept request
        Route::post('/{id}/reject', [AppointmentController::class, 'reject']); // Reject request
    });

    // Extra collaborator route
    Route::get('/collaborator/appointments', [AppointmentController::class, 'collaboratorAppointments']);
});
