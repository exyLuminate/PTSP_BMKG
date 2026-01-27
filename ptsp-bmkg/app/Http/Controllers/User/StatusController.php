<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\DataRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StatusController extends Controller
{
    public function index()
    {
        return Inertia::render('User/CekStatus');
    }

    public function search(Request $request)
    {
        $request->validate([
            'nik' => 'required|digits:16',
        ]);

        $searchNik = $request->query('nik');

        $results = DataRequest::with('catalog')->get()->filter(function ($item) use ($searchNik) {
            return $item->nik === $searchNik;
        });

        return Inertia::render('User/CekStatus', [
            'results' => $results->values(),
            'search_nik' => $searchNik
        ]);
    }

    public function show($ticket)
    {
        $requestData = DataRequest::with('catalog')
            ->where('ticket_code', $ticket)
            ->first();

        if (!$requestData) {
            return redirect()->route('status.index')->withErrors(['message' => 'Tiket tidak ditemukan.']);
        }

        return Inertia::render('User/DetailStatus', [
            'request_data' => $requestData 
        ]);
    }

    public function verifyPassword(Request $request)
    {
        $request->validate([
            'ticket' => 'required|exists:requests,ticket_code',
            'password' => 'required',
        ]);

        $requestData = DataRequest::where('ticket_code', $request->ticket)->first();

        if ($request->password !== $requestData->access_password) {
            return back()->withErrors([
                'password' => 'Password yang Anda masukkan salah.'
            ]);
        }

        return back();
    }
    
    public function uploadProof(Request $request, $ticket)
    {
        $request->validate([
            'payment_proof' => 'required|mimes:pdf,jpg,png|max:4096',
        ]);

        $data = DataRequest::where('ticket_code', $ticket)->firstOrFail();

        // LOGIKA DELETE & OVERWRITE: Hapus bukti lama jika ada
        if ($data->payment_proof_path) {
            Storage::disk('local')->delete($data->payment_proof_path);
        }

        $path = $request->file('payment_proof')->store('private/proofs');

        $data->update([
            'payment_proof_path' => $path,
            'status' => 'verifikasi_payment' 
        ]);

        return back()->with('success', 'Bukti pembayaran berhasil diunggah.');
    }

    // FUNGSI BARU: Minta Billing Baru jika Invalid
    public function reRequestBilling($ticket)
    {
        $data = DataRequest::where('ticket_code', $ticket)->firstOrFail();

        // Hanya boleh jika statusnya invalid
        if ($data->status !== 'invalid') return back();

        // Hapus file VA lama yang sudah expired
        if ($data->va_file_path) {
            Storage::disk('local')->delete($data->va_file_path);
        }

        $data->update([
            'status' => 'on_process',
            'va_file_path' => null,
            'va_expired_at' => null,
            'admin_note' => 'User meminta ulang kode billing karena expired.'
        ]);

        return back()->with('success', 'Permintaan billing baru telah dikirim ke Admin.');
    }

    // FUNGSI BARU: Download Hasil & Track downloaded_at
    public function downloadResult(Request $request, $id)
    {
        $data = DataRequest::findOrFail($id);

        // Validasi password akses dari request (keamanan tambahan)
        if ($request->password !== $data->access_password) abort(403);

        // Cek apakah link sudah expired (> 3 hari)
        if ($data->status === 'expired') abort(410, 'Link download sudah kadaluwarsa.');

        // Update tracking download jika pertama kali
        if (is_null($data->downloaded_at)) {
            $data->update([
                'downloaded_at' => now(),
                'status' => 'done'
            ]);
        }

        return Storage::disk('local')->download($data->result_file_path, "Hasil_Data_{$data->ticket_code}.pdf");
    }
}