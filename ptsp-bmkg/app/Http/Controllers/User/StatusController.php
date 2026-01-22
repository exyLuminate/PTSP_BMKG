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
            'payment_proof' => 'required|mimes:pdf|max:4096',
        ]);

        $data = DataRequest::where('ticket_code', $ticket)->firstOrFail();

        $path = $request->file('payment_proof')->store('private/proofs');

        $data->update([
            'payment_proof_path' => $path,
            'status' => 'verifikasi_payment' 
        ]);

        return back()->with('success', 'Bukti pembayaran berhasil diunggah.');
    }
}