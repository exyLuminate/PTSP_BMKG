<?php

namespace App\Http\Controllers;

use App\Models\DataRequest; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class FileStreamController extends Controller
{
    public function streamForAdmin($id, $type)
    {
        // Gunakan DataRequest langsung jika nama class-nya memang DataRequest
        $data = DataRequest::findOrFail($id);
        
        $path = match($type) {
            'ktp'     => $data->ktp_path,
            'letter'  => $data->letter_path,
            'proof'   => $data->payment_proof_path,
            'va', 'billing' => $data->va_file_path, // Bisa dipanggil 'va' atau 'billing'
            'result'  => $data->result_file_path,
            default   => null
        };

        if (!$path || !Storage::disk('local')->exists($path)) {
            // Tips Debug: Hapus komentar line di bawah ini jika masih 404 untuk cek log
            // \Log::info("Stream 404: ID {$id}, Type {$type}, Path {$path}");
            abort(404, 'File tidak ditemukan di server.');
        }

        $file = Storage::disk('local')->get($path);
        $mimeType = Storage::disk('local')->mimeType($path);

        return response($file, 200)->header('Content-Type', $mimeType);
    }
}