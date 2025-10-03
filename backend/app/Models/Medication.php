<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class Medication extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    protected $fillable = [
        'patient_id',
        'medication_name',
        'dosage',
        'unit',
        'frequency',
        'start_date',
        'end_date',
        'prescribed_by',
        'reminder_schedule',
        'instructions',
        'possible_side_effects',
        'take_with_food',
        'as_needed_prn'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function analyses()
    {
        return $this->hasMany(MedicationAnalysis::class);
    }

    public function intakes()
    {
        return $this->hasMany(MedicationIntake::class);
    }
}
