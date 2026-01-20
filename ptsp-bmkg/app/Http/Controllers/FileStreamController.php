<?php

namespace App\Http\Controllers;

use App\Models\Request as DataRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FileStreamController extends Controller
{
    /**
     * Menampilkan file privat untuk Admin
     */
    public function streamForAdmin($id, $type)
    {
        $data = DataRequest::findOrFail($id);
        
        // Pilih path berdasarkan tipe file yang diminta
        $path = match($type) {
            'ktp' => $data->ktp_path,
            'letter' => $data->letter_path,
            'va' => $data->va_file_path,
            'result' => $data->result_file_path,
            default => null
        };

        if (!$path || !Storage::exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return response()->file(storage_path('app/' . $path));
    }
}