<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Collaborator extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'collaborators';

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = [
        'availability' => 'boolean',
    ];

    protected $fillable = [
        'id',
        'user_id',
        'speciality',
        'license_number',
        'workplace',
        'isAvailable',
        'availability',
        'rating',
    ];

    protected $dates = ['deleted_at'];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function patients()
    {
        return $this->hasManyThrough(Patient::class, Appointment::class, 'collaborator_id', 'id', 'id', 'patient_id');
    }

    // Dans ton modèle Collaborator, ajoute :
    public function getIsAvailableAttribute()
    {
        return (bool) $this->attributes['availability'];
    }

    public function setIsAvailableAttribute($value)
    {
        $this->attributes['availability'] = $value;
    }
}
