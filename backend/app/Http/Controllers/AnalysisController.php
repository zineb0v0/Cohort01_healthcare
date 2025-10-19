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
        $string = iconv('UTF-8', 'UTF-8//IGNORE', $string);
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

        // ✅ --- Personnalisation du PDF ---
        $customHtml = '
        <html>
        <head>
            <style>
                body {
                    font-family: "DejaVu Sans", sans-serif;
                    margin: 40px;
                    background-color: #f9f9f9;
                    color: #333;
                }
                h1 {
                    color: #0056b3;
                    text-align: center;
                    font-size: 28px;
                    margin-bottom: 30px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .section-title {
                    color: #e63946;
                    font-size: 20px;
                    margin-top: 25px;
                    border-bottom: 2px solid #e63946;
                    display: inline-block;
                    padding-bottom: 5px;
                }
                p {
                    line-height: 1.6;
                    font-size: 14px;
                    text-align: justify;
                    margin-top: 10px;
                }
                .footer {
                    text-align: center;
                    margin-top: 50px;
                    font-size: 12px;
                    color: #777;
                }
                .box {
                    background: #fff;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
                }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>Rapport d\'Analyse Médicale par IA</h1>
                <h2 class="section-title">Résultat de l\'analyse</h2>
                <p>' . nl2br(e($result)) . '</p>

                <div class="footer">
                    Généré automatiquement le ' . now()->format('d/m/Y à H:i') . ' par le système d\'analyse IA.
                </div>
            </div>
        </body>
        </html>
        ';

        // ✅ Générer le PDF avec ce design
        $pdf = Pdf::loadHTML($customHtml);
        $resultPath = 'results/result_' . time() . '.pdf';
        Storage::disk('public')->put($resultPath, $pdf->output());

        // ✅ Sauvegarde dans la base
        $analysis = Analysis::create([
            'filename' => $filepath,
            'type' => $type,
            'result' => $result,
            'result_file' => $resultPath,
            'patient_id' => $request->patient_id,
        ]);

        // ✅ Retour JSON
       // ✅ Sauvegarde dans la base
$analysis = Analysis::create([
    'filename' => $file->getClientOriginalName(), // <-- meilleur pour afficher le nom
    'type' => $type,
    'result' => $result,
    'result_file' => $resultPath,
    'patient_id' => $request->patient_id,
]);

return response()->json($analysis, 201, [], JSON_UNESCAPED_UNICODE);

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

        return response()->json(['success' => true, 'message' => 'Analyse supprimée']);
    }
}
