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

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'user_id',
        'speciality',
        'license_number',
        'workplace',
        'availability',
        'rating',
    ];

    protected static function booted()
    {
        static::creating(function ($collaborator) {
            if (!$collaborator->id) {
                $collaborator->id = (string) Str::uuid();
            }
        });
    }

    public function setRatingAttribute($value)
    {
        $this->attributes['rating'] = $value >= 0 && $value <= 100 ? $value : 0;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}