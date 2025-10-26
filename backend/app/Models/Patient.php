<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Patient extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'urgencyNumber'
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    protected $dates = ['deleted_at'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function medications()
    {
        return $this->hasMany(Medication::class);
    }

    public function dossier()
    {
        return $this->hasOne(MedicalDossier::class);
    }

    public function intakes()
    {
        return $this->hasMany(MedicationIntake::class);
    }

    public function analyses()
    {
        return $this->hasMany(MedicationAnalysis::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id', 'id');
    }

    public function labReports()
    {
        return $this->hasMany(LabReport::class, 'patient_id', 'id');
    }

    // public function collaborator()
    // {
    //     return $this->belongsTo(Collaborator::class);
    // }
}
