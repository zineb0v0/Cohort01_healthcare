<?php

use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\API\MedicationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalysisController;
use App\Http\Controllers\AuthController;


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
/* Route::get(  '/upload', function() {
  //  return view('upload');
//});
//Route::post('/upload', [AnalysisController::class, 'store'])->name('analyses.store');
*/

Route::post('/analyses', [AnalysisController::class, 'store']);
Route::get('/analyses', [AnalysisController::class, 'index']);
Route::delete('/analyses/{id}', [AnalysisController::class, 'destroy']);


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
     Route::get('/collaborator/appointments', [\App\Http\Controllers\CollaboratorController::class, 'getCollaboratorAppointments']);
    Route::get('/collaborator/patients', [\App\Http\Controllers\CollaboratorController::class, 'getCollaboratorPatients']);
    Route::post('/collaborator/appointments/{appointmentId}/confirm', [\App\Http\Controllers\CollaboratorController::class, 'confirmAppointment']);
    Route::post('/collaborator/appointments/{appointmentId}/cancel', [\App\Http\Controllers\CollaboratorController::class, 'cancelAppointment']);
    Route::put('/collaborator/appointments/{appointmentId}', [\App\Http\Controllers\CollaboratorController::class, 'updateAppointment']);
    Route::get('/collaborator/profile', [\App\Http\Controllers\CollaboratorController::class, 'getCollaboratorProfile']);
    Route::put('/collaborator/profile', [\App\Http\Controllers\CollaboratorController::class, 'updateCollaboratorProfile']);

   });

Route::middleware('auth:sanctum')->group(function () {
    // Dashboard du patient
    Route::get('/patient/dashboard', [PatientController::class, 'dashboard']);

    // CRUD medications
    Route::get('/patient/medications', [MedicationController::class, 'index']);
    Route::post('/patient/medications', [MedicationController::class, 'store']);
    Route::put('/patient/medications/{id}', [MedicationController::class, 'update']);
    Route::delete('/patient/medications/{id}', [MedicationController::class, 'destroy']);
});


