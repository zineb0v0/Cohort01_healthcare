<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\MedicationIntake;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class MedicationIntakeController extends Controller
{
    public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:scheduled,taken,missed,late'
    ]);

    $intake = MedicationIntake::findOrFail($id);
    $intake->status = $request->status;

    if ($request->status === 'taken') {
        $intake->taken_time = now();
    }

    $intake->save();

    return response()->json([
        'message' => 'Statut mis à jour avec succès',
        'medication_intake' => $intake
    ]);
}


}
