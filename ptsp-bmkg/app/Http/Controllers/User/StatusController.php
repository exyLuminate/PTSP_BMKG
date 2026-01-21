<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\DataRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StatusController extends Controller
{
    public function index()
    {
        return Inertia::render('User/CekStatus');
    }

    public function search(Request $request)
    {
        // Validasi NIK (karena GET, data ada di query string)
        $request->validate([
            'nik' => 'required|digits:16',
        ]);

        $searchNik = $request->query('nik');

        // Jika NIK di-encrypt dan menggunakan Accessor, kita harus menggunakan filter (Data Kecil)
        // Jika data sudah ribuan, disarankan gunakan teknik 'nik_hash' yang kita bahas tadi.
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
        // Mencari data berdasarkan parameter {ticket} di URL
        $requestData = DataRequest::with('catalog')
            ->where('ticket_code', $ticket)
            ->first();

        if (!$requestData) {
            return redirect()->route('status.index')->withErrors(['message' => 'Tiket tidak ditemukan.']);
        }

        return Inertia::render('User/DetailStatus', [
            'request_data' => $requestData // Pastikan nama prop sama dengan di DetailStatus.jsx
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

        // Jika benar, hanya kembali (onSuccess di React akan mengubah state isVerified)
        return back();
    }
    
    public function uploadProof(Request $request, $ticket)
    {
        $request->validate([
            'payment_proof' => 'required|mimes:pdf|max:4096',
        ]);

        $data = DataRequest::where('ticket_code', $ticket)->firstOrFail();

        // Gunakan folder private agar aman
        $path = $request->file('payment_proof')->store('private/proofs');

        $data->update([
            'payment_proof_path' => $path,
            'status' => 'verifikasi_payment' 
        ]);

        return back()->with('success', 'Bukti pembayaran berhasil diunggah.');
    }
}