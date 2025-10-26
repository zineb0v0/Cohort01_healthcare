<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MedicationIntake extends Model
{
    use HasFactory;
    protected $table = 'medication_intakes'; // Forcer le nom de la table
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'patient_id',
        'medication_id',
        'scheduled_time',
        'taken_time',
        'status'
    ];

      protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function medication()
    {
        return $this->belongsTo(Medication::class, 'medication_id', 'id');
    }
}
