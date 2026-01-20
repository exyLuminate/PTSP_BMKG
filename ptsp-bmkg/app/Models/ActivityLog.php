<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = ['user_id', 'action', 'details']; 

    protected $casts = [
        'details' => 'array', // Agar data array bisa disimpan di DB [cite: 73]
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function record($action, $details = null)
    {
        return self::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'details' => $details,
        ]);
    }
}