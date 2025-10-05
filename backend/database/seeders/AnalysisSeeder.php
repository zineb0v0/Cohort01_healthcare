<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalysisSeeder extends Seeder
{
    public function run(): void
    {
        $analyses = [
            [
                'filename' => 'blood_glucose_test_' . date('Y-m-d') . '.pdf',
                'type' => 'pdf',
                'result' => 'Blood Glucose Analysis: Fasting glucose level 125 mg/dL - slightly elevated, recommend dietary adjustments and medication review.',
                'result_file' => 'reports/glucose_test_patient1_' . date('Y-m-d') . '.pdf',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'filename' => 'lipid_panel_' . date('Y-m-d') . '.pdf',
                'type' => 'pdf',
                'result' => 'Lipid Panel Analysis: Total cholesterol 180 mg/dL, LDL 110 mg/dL, HDL 45 mg/dL - levels within acceptable range.',
                'result_file' => 'reports/lipid_panel_patient1_' . date('Y-m-d') . '.pdf',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'filename' => 'chest_xray_' . date('Y-m-d') . '.jpg',
                'type' => 'img',
                'result' => 'Chest X-Ray Analysis: No abnormalities detected. Clear lung fields, normal heart size and position.',
                'result_file' => 'images/chest_xray_patient2_' . date('Y-m-d') . '.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'filename' => 'complete_blood_count_' . date('Y-m-d') . '.pdf',
                'type' => 'pdf',
                'result' => null,
                'result_file' => 'reports/cbc_patient3_' . date('Y-m-d') . '.pdf',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'filename' => 'mri_brain_scan_' . date('Y-m-d') . '.jpg',
                'type' => 'img',
                'result' => 'MRI Brain Scan Analysis: Normal brain structure, no masses or abnormalities detected.',
                'result_file' => 'images/mri_brain_patient3_' . date('Y-m-d') . '.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('analyses')->insert($analyses);
    }
}
