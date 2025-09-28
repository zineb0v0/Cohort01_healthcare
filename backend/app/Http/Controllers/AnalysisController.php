<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Analysis;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Http;
use Barryvdh\DomPDF\Facade\Pdf;

class AnalysisController extends Controller
{
    private function cleanUtf8($string)
    {
        if ($string === null) return '';

        // 🟢 نحاول نصحح أي مشكلة UTF-8
        $string = iconv('UTF-8', 'UTF-8//IGNORE', $string);

        // 🟢 نحيد أي كاراكتر خارج النطاق
        $string = preg_replace('/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/u', '', $string);

        return $string ?: '';
    }

   public function store(Request $request)
{
    // ✅ Validation du fichier
    $request->validate([
        'file' => 'required|mimes:pdf,txt,jpg,jpeg,png',
    ]);

    // ✅ Sauvegarde du fichier uploadé
    $file = $request->file('file');
    $type = $file->getClientOriginalExtension();
    $filepath = $file->store('public/uploads');

    // ✅ Extraction du texte
    $text = '';
    if ($type === 'pdf') {
        $parser = new Parser();
        $pdf = $parser->parseFile(storage_path('app/' . $filepath));
        $text = $pdf->getText();
    } elseif ($type === 'txt') {
        $text = file_get_contents($file->getRealPath());
    } else {
        $text = "[Texte d'image non supporté pour l'instant]";
    }

    // 🔹 Nettoyage UTF-8
    $text = $this->cleanUtf8($text);

    // ✅ Préparer payload Gemini
    $payload = [
        'contents' => [
            [
                'parts' => [
                    ['text' => "Tu es un médecin expert. Analyse le texte suivant et dis quelles maladies ou problèmes le patient peut avoir:\n\n" . $text]
                ]
            ]
        ]
    ];

    // ✅ Appel à l'API Gemini
    $response = Http::withHeaders([
        'Content-Type' => 'application/json',
        'X-goog-api-key' => env('GEMINI_API_KEY'),
    ])->post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        $payload
    );

    if ($response->failed()) {
        return response()->json([
            'success' => false,
            'error' => $response->body()
        ], 500);
    }

    $responseJson = $response->json();

    // ✅ Extraction du texte généré
    $result = 'Pas de résultat reçu';
    if (!empty($responseJson['candidates'][0]['content']['parts'][0]['text'])) {
        $result = $responseJson['candidates'][0]['content']['parts'][0]['text'];
        $result = $this->cleanUtf8($result);
    }

    // ✅ Générer PDF du résultat
    $pdf = Pdf::loadHTML('<h1>Résultat d\'analyse</h1><p>' . nl2br($result) . '</p>');
    $resultPath = 'public/results/result_' . time() . '.pdf';
    Storage::put($resultPath, $pdf->output());

    // ✅ Sauvegarde en DB
    $analysis = Analysis::create([
        'filename' => $filepath,
        'type' => $type,
        'result' => $result,
        'result_file' => $resultPath, // Nouveau champ pour le PDF
    ]);

    // ✅ Retour JSON propre
    return response()->json([
        'success' => true,
        'analysis_id' => $analysis->id,
        'result' => $result,
        'result_file' => $resultPath,
    ], 200, [], JSON_UNESCAPED_UNICODE);
}

    public function index()
{
    return response()->json(Analysis::latest()->get());
}

public function destroy($id)
{
    $analysis = Analysis::findOrFail($id);
    if ($analysis->filename && Storage::exists($analysis->filename)) {
        Storage::delete($analysis->filename);
    }

    $analysis->delete();

    return response()->json(['success' => true, 'message' => 'Analysis supprimé']);
}

}
