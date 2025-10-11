<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class Patient extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Notifiable;

    protected $table = 'patients';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
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

    // public function appointments()
    // {
    //     return $this->hasMany(Appointment::class, 'patient_id', 'patient_id');
    // }

    // public function labReports()
    // {
    //     return $this->hasMany(LabReport::class, 'patient_id', 'patient_id');
    // }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
