<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = ['user_id', 'action', 'details']; 

    protected $casts = [
        'details' => 'json', // Agar data array bisa disimpan di DB [cite: 73]
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}