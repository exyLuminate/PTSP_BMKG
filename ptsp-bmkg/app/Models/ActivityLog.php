<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id', 
        'action', 
        'details', 
        'ip_address', 
        'user_agent'
    ]; 

    protected $casts = [
        'details' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Static helper untuk mencatat log secara otomatis
     */
    public static function record($action, $details = null)
    {
        return self::create([
            'user_id'    => auth()->id(), // null jika bukan user login
            'action'     => $action,
            'details'    => $details,
            'ip_address' => Request::ip(), // Ambil IP otomatis
            'user_agent' => Request::header('User-Agent'), // Ambil info Browser/OS otomatis
        ]);
    }
}