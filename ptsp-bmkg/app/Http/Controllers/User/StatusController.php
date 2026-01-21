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

        $results = DataRequest::all()->filter(function ($item) use ($request) {
            return $item->nik === $request->nik;
        });

        return Inertia::render('User/CekStatus', [
            'results' => $results->values(),
            'search_nik' => $request->nik
        ]);
    }
    
    public function uploadProof(Request $request, $ticket)
    {
        $request->validate([
            'payment_proof' => 'required|mimes:jpg,jpeg,png,pdf|max:4096',
        ]);

        $data = DataRequest::where('ticket_code', $ticket)->firstOrFail();

        $path = $request->file('payment_proof')->store('documents/payments');

        $data->update([
            'payment_proof_path' => $path,
            'status' => 'payment_uploaded'
        ]);

        return back()->with('success', 'Bukti pembayaran berhasil diunggah.');
    }
}