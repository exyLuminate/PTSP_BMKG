<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class DataRequest extends Model
{
    use HasFactory;

    protected $table = 'requests';

    protected $fillable = [
        'ticket_code',
        'nik',
        'access_password',
        'name',
        'email',
        'description',
        'quantity',
        'ktp_path',
        'letter_path',
        'payment_proof_path', 
        'data_catalog_id',
        'status',
        'va_file_path',     
        'result_file_path',
        'admin_note',
        'va_expired_at',
        'download_expired_at',
        'downloaded_at' 
    ];

    protected $casts = [
        'va_expired_at' => 'datetime',
        'download_expired_at' => 'datetime',
        'downloaded_at' => 'datetime',
    ];

    public function catalog()
    {
        return $this->belongsTo(DataCatalog::class, 'data_catalog_id');
    }

    /**
     * Accessor untuk NIK: Otomatis Dekripsi saat dipanggil
     */
    public function getNikAttribute($value)
    {
        try {
            return Crypt::decryptString($value);
        } catch (\Exception $e) {
            return $value;
        }
    }
}