<?php

use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\API\MedicationController;
use App\Http\Controllers\ProfileController;
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
    $profile = auth()->user()->profile;
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
    ];
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
