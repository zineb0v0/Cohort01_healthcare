<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MedicalDossier extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'patient_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'id');
    }

    public function medications()
    {
        return $this->hasMany(Medication::class, 'patient_id', 'patient_id');
    }

    public function analytics()
    {
        return $this->hasManyThrough(
            MedicationAnalysis::class,
            Medication::class,
            'patient_id',     // clé étrangère dans medications
            'medication_id',  // clé étrangère dans medication_analytics
            'patient_id',     // clé locale dans medical_dossiers
            'id'              // clé locale dans medications
        );
    }
}
