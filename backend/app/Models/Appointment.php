<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'appointments';

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'patient_id',
        'collaborator_id',
        'date',           // Your actual column name
        'time',         // Your actual column name
        'status',
        'type',               // Your actual column name
         'isTelehealth',
    'telehealthLink',
    'deleted_at',    // Your actual column name
    ];
    protected $casts = [
        'isTelehealth' => 'boolean',
        'date' => 'datetime',
        'time' => 'string',
    ];
    protected $dates = ['deleted_at'];

    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    // public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'canceled';
    public const STATUS_COMPLETED = 'completed';

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function collaborator()
    {
        return $this->belongsTo(Collaborator::class);
    }

    public function medicalDossier()
    {
        return $this->belongsTo(MedicalDossier::class, 'medical_dossier_id', 'id');
    }

    // Scopes for easier querying
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', self::STATUS_CONFIRMED);
    }

    public function scopeForPatient($query, $patientId)
    {
        return $query->where('patient_id', $patientId);
    }

    public function scopeForCollaborator($query, $collaboratorId)
    {
        return $query->where('collaborator_id', $collaboratorId);
    }

    // Helper methods
    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isConfirmed()
    {
        return $this->status === self::STATUS_CONFIRMED;
    }

    public function canBeCancelled()
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_CONFIRMED]);
    }
}
