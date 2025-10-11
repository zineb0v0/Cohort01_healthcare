<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'appointments';

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'date', 'time', 'status',
        'patient_id', 'collaborator_id',
        'isTelehealth', 'telehealthLink',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function collaborator()
    {
        return $this->belongsTo(Collaborator::class);
    }
}
