<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Medication extends Model
{
    use HasFactory;
    use SoftDeletes;

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
        'as_needed_prn',
    ];
    protected $casts = [
        'take_with_food' => 'boolean',
        'as_needed_prn' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'reminder_schedule' => 'string',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'id');
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
