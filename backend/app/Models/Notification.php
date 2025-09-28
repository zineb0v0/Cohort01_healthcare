<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'patient_id',
        'type',
        'message',
        'send_time',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
