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
        'id', 
        'patient_id', 
        'collaborator_id', 
        'medical_dossier_id',
        'datetime',           // Your actual column name
        'start_time',         // Your actual column name  
        'status',
        'type',               // Your actual column name
        'is_telehealth',      // Your actual column name
        'telehealth_url',     // Your actual column name
        'notes',
        'created_at',
        'updated_at',
        'deleted_at'
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
