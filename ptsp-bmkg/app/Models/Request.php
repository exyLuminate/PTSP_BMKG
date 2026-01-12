<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $fillable = [
        'ticket_code', 'nik', 'access_password', 'name', 'email', 
        'description', 'quantity', 'ktp_path', 'letter_path', 
        'data_catalog_id', 'status', 'va_number', 'result_file_path', 
        'admin_note', 'ready_at', 'va_expired_at', 'download_expired_at'
    ]; 

    // Casting: Otomatis enkripsi NIK dan ubah string tanggal jadi objek Carbon [cite: 14, 145]
    protected $casts = [
        'nik' => 'encrypted',
        'ready_at' => 'datetime', 
        'va_expired_at' => 'datetime', 
        'download_expired_at' => 'datetime',
    ];

    public function catalog()
    {
        return $this->belongsTo(DataCatalog::class, 'data_catalog_id');
    }
}
