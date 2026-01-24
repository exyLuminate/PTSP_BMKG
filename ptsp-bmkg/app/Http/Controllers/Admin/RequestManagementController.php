<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataRequest; // Sesuaikan jika nama filenya DataRequest.php
use App\Models\ActivityLog;
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
                  // Catatan: Pencarian NIK di database akan sulit jika dienkripsi.
                  // Sementara fokus ke ticket_code atau nama.
                  ->orWhere('name', 'like', '%' . $request->search . '%'); 
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

    $request->validate([
        // Pastikan status 'invalid' sudah masuk dalam validasi sesuai revisi pembimbing
        'status' => 'required|in:on_process,rejected,waiting_payment,verifikasi_payment,paid,invalid,expired,done',
        'admin_note' => 'nullable|string',
        'va_file' => 'nullable|file|mimes:pdf|max:2048', 
        'result_file' => 'nullable|file|mimes:pdf,zip|max:10240', 
    ]);

    // --- 1. PROSES FILE VA / BILLING ---
    if ($request->hasFile('va_file')) {
        // Hapus file fisik lama jika ada (fitur overwrite)
        if ($dataRequest->va_file_path) {
            Storage::disk('local')->delete($dataRequest->va_file_path);
        }
        $dataRequest->va_file_path = $request->file('va_file')->store('private/billing');
        
        // HANYA set tanggal expired billing jika status yang dikirim adalah 'waiting_payment'
        if ($request->status === 'waiting_payment') {
            $dataRequest->va_expired_at = now()->addDays(7);
        }
    }

    // --- 2. PROSES FILE HASIL DATA ---
    if ($request->hasFile('result_file')) {
        // Hapus file fisik lama jika ada
        if ($dataRequest->result_file_path) {
            Storage::disk('local')->delete($dataRequest->result_file_path);
        }
        $dataRequest->result_file_path = $request->file('result_file')->store('private/results');
        
        // HANYA set tanggal expired download jika status yang dikirim adalah 'paid'
        if ($request->status === 'paid') {
            $dataRequest->download_expired_at = now()->addDays(3);
        }
    }

    // --- 3. UPDATE STATUS & CATATAN ---
    // Status mutlak mengikuti input 'status' dari tombol yang diklik di frontend
    $dataRequest->status = $request->status;
    $dataRequest->admin_note = $request->admin_note;
    $dataRequest->save();

    // --- 4. LOG AKTIVITAS ---
    ActivityLog::record('update_request_status', [
        'ticket_code' => $dataRequest->ticket_code,
        'new_status'  => $dataRequest->status,
        'has_billing' => $dataRequest->va_file_path ? 'Ya' : 'Tidak',
        'has_result'  => $dataRequest->result_file_path ? 'Ya' : 'Tidak',
    ]);

    return redirect()->back()->with('success', 'Status permohonan berhasil diperbarui.');
}
}