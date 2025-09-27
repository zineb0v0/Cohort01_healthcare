<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; 
use Illuminate\Support\Str;

class Medication extends Model
{
    use HasFactory;


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) \Illuminate\Support\Str::uuid();
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
}

