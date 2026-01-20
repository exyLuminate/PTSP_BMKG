<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Request as DataRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RequestManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = DataRequest::with('catalog');

        if ($request->search) {
            $query->where('ticket_code', 'like', '%' . $request->search . '%')
                  ->orWhere('nik', $request->search); 
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/RequestList', [
            'requests' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show($id)
    {
        $requestData = DataRequest::with('catalog')->findOrFail($id);
        
        return Inertia::render('Admin/RequestDetail', [
            'requestData' => $requestData,
        ]);
    }

    public function update(Request $request, $id)
    {
        $dataRequest = DataRequest::findOrFail($id);

        // 1. Validasi Status dan File berdasarkan Alur Baru
        $validated = $request->validate([
            'status' => 'required|in:on_process,waiting_payment,verifikasi_payment,paid,expired,done,rejected',
            'admin_note' => 'nullable|string',
            'va_file' => 'nullable|file|mimes:pdf|max:2048', // PDF Billing
            'result_file' => 'nullable|file|mimes:pdf,zip|max:10240', // File Data Hasil
        ]);

        // 2. Logika Menuju Status WAITING_PAYMENT (Admin Kirim Billing & Data)
        if ($request->status === 'waiting_payment') {
            // Wajib upload file VA/Billing
            if ($request->hasFile('va_file')) {
                $pathVa = $request->file('va_file')->store('private/billing');
                $dataRequest->va_file_path = $pathVa;
            }

            // Wajib upload file Hasil Data di awal (Hidden dari User)
            if ($request->hasFile('result_file')) {
                $pathResult = $request->file('result_file')->store('private/results');
                $dataRequest->result_file_path = $pathResult;
            }

            $dataRequest->va_expired_at = now()->addDays(7); // Masa aktif Billing 7 hari
        }

        // 3. Logika Menuju Status PAID (Admin Verifikasi Bukti Bayar)
        if ($request->status === 'paid') {
            $dataRequest->download_expired_at = now()->addDays(3); // Jendela unduh 3 hari
        }

        // 4. Update data umum
        $dataRequest->status = $request->status;
        $dataRequest->admin_note = $request->admin_note;
        $dataRequest->save();

        return redirect()->back()->with('success', 'Status permohonan berhasil diperbarui.');
    }
}