<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalysisController;

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
});


