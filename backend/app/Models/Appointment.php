<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Appointment extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'appointments';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'patient_id',
        'collaborator_id',
        'date',
        'time',
        'status',
        'type',
        'is_telehealth',
        'telehealthLink',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    protected $dates = ['deleted_at'];

    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'canceled';
    public const STATUS_COMPLETED = 'completed';

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    // Relationships
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'id');
    }

    public function collaborator()
    {
        return $this->belongsTo(Collaborator::class, 'collaborator_id', 'id');
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
