<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Request as DataRequest; 
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
            $query->where(function($q) use ($request) {
                $q->where('ticket_code', 'like', '%' . $request->search . '%')
                  ->orWhere('name', 'like', '%' . $request->search . '%');
            });
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
        $oldStatus = $dataRequest->status;

        // --- 1. VALIDASI LENTUR ---
        // Kita buat admin_note nullable. Validasi "Wajib Isi" dipindah ke React (Frontend).
        // Max file kita naikkan sedikit agar tidak gampang error "failed to upload".
       $request->validate([
        'status' => 'required|in:on_process,rejected,waiting_payment,verifikasi_payment,paid,invalid,expired,done',
        'admin_note' => 'nullable|string', 
        
        // VALIDASI FILE KONDISIONAL:
        // Wajib ada file jika status berubah ke 'waiting_payment' dan sebelumnya belum ada file di DB
        'va_file' => [
            $request->status === 'waiting_payment' && !$dataRequest->va_file_path ? 'required' : 'nullable',
            'file', 'max:5120'
        ],
        // Wajib ada file jika status berubah ke 'paid' dan sebelumnya belum ada file di DB
        'result_file' => [
            $request->status === 'paid' && !$dataRequest->result_file_path ? 'required' : 'nullable',
            'file', 'max:20480'
        ],
    ]);
        // --- 2. PROSES FILE VA / BILLING (Masa Aktif 7 Hari) ---
        if ($request->hasFile('va_file') && $request->file('va_file')->isValid()) {
            // Hapus file lama jika ada
            if ($dataRequest->va_file_path) {
                Storage::disk('local')->delete($dataRequest->va_file_path);
            }
            
            // Simpan file baru
            $dataRequest->va_file_path = $request->file('va_file')->store('private/billing');
            
            // Set expired 7 hari hanya jika status berubah ke waiting_payment
            if ($request->status === 'waiting_payment') {
                $dataRequest->va_expired_at = now()->addDays(7);
            }
        }

        // --- 3. PROSES FILE HASIL DATA (Masa Aktif 14 Hari) ---
        if ($request->hasFile('result_file') && $request->file('result_file')->isValid()) {
            if ($dataRequest->result_file_path) {
                Storage::disk('local')->delete($dataRequest->result_file_path);
            }
            
            $dataRequest->result_file_path = $request->file('result_file')->store('private/results');
            
            // Set expired unduh 14 hari hanya jika status berubah ke paid
            if ($request->status === 'paid') {
                $dataRequest->download_expired_at = now()->addDays(14);
            }
        }

        // --- 4. SIMPAN DATA ---
        $dataRequest->status = $request->status;
        $dataRequest->admin_note = $request->admin_note;

        // SAFETY TRIGGER: Untuk Masa Unduh 14 Hari
        if ($request->status === 'paid' && is_null($dataRequest->download_expired_at)) {
            $dataRequest->download_expired_at = now()->addDays(14);
        }

        // SAFETY TRIGGER: Untuk Masa Billing 7 Hari (Opsional tapi disarankan)
        if ($request->status === 'waiting_payment' && is_null($dataRequest->va_expired_at)) {
            $dataRequest->va_expired_at = now()->addDays(7);
        }
        $dataRequest->save();

        // --- 5. LOG AKTIVITAS ---
        ActivityLog::record('update_request_status', [
            'ticket_code' => $dataRequest->ticket_code,
            'status_awal' => $oldStatus,
            'status_baru' => $dataRequest->status,
            'admin_note'  => $dataRequest->admin_note ?? '-',
        ]);

        return redirect()->back()->with('success', 'Perubahan berhasil disimpan.');
    }
}