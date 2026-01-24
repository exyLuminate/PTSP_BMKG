<?php

namespace App\Http\Controllers;

use App\Models\DataRequest; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class FileStreamController extends Controller
{
    /**
     * STREAM UNTUK ADMIN
     * Tidak butuh password karena sudah lewat middleware 'auth'
     */
    public function streamForAdmin($id, $type)
    {
        $data = DataRequest::findOrFail($id);
        
        $path = match($type) {
            'ktp'           => $data->ktp_path,
            'letter'        => $data->letter_path,
            'proof'         => $data->payment_proof_path,
            'va', 'billing' => $data->va_file_path,
            'result'        => $data->result_file_path,
            default         => null
        };

        return $this->streamFile($path);
    }

    /**
     * STREAM UNTUK USER (PEMOHON)
     * Wajib kirim ?password= di URL untuk verifikasi akses
     */
    public function streamForUser(Request $request, $id, $type)
    {
        $data = DataRequest::findOrFail($id);

        if ($request->password !== $data->access_password) {
            abort(403, 'Akses ditolak. Password akses salah.');
        }

        if ($type === 'result' && $data->download_expired_at && $data->download_expired_at->isPast()) {
        
        // Opsional: Sambil nolak, kita update statusnya di DB biar sinkron
        if ($data->status !== 'expired') {
            $data->update(['status' => 'expired']);
        }

        abort(410, 'Maaf, masa berlaku tautan unduhan ini sudah berakhir.');
    }

        // --- LOGIKA TRACKING BARU ---
        // Jika user mengakses file HASIL (result), tandai sebagai 'done' dan catat waktunya
        if ($type === 'result' && $data->status === 'paid') {
            if (is_null($data->downloaded_at)) {
                $data->update([
                    'downloaded_at' => now(),
                    'status' => 'done'
                ]);
            }
        }

        $path = match($type) {
            'billing' => $data->va_file_path,
            'result'  => $data->result_file_path,
            'proof'   => $data->payment_proof_path,
            'ktp'     => $data->ktp_path,
            default   => null
        };

        return $this->streamFile($path);
    }

    /**
     * HELPER: Fungsi inti untuk mengirim file ke browser
     */
    private function streamFile($path)
    {
        if (!$path || !Storage::disk('local')->exists($path)) {
            abort(404, 'File tidak ditemukan di server.');
        }

        $file     = Storage::disk('local')->get($path);
        $mimeType = Storage::disk('local')->mimeType($path);

        // Mengembalikan file dengan header PDF/Image yang benar
        return response($file, 200)->header('Content-Type', $mimeType);
    }
}