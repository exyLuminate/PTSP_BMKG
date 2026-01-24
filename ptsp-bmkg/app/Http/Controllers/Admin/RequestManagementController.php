<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Request as DataRequest; // Sesuaikan jika nama model kamu Request
use App\Models\ActivityLog;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class RequestManagementController extends Controller
{
    public function index(Request $request)
    {
        // Gunakan query builder agar lebih fleksibel
        $query = DataRequest::with('catalog');

        // 1. Logika Pencarian (Gunakan Closure/Grouping)
        // Ini supaya filter status tidak "bocor" saat mencari nama/tiket
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('ticket_code', 'like', '%' . $request->search . '%')
                  ->orWhere('name', 'like', '%' . $request->search . '%');
            });
        }

        // 2. Logika Filter Status
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
            'status' => 'required|in:on_process,rejected,waiting_payment,verifikasi_payment,paid,invalid,expired,done',
            'admin_note' => 'nullable|string',
            'va_file' => 'nullable|file|mimes:pdf|max:2048', 
            'result_file' => 'nullable|file|mimes:pdf,zip|max:10240', 
        ]);

        // --- 1. PROSES FILE VA / BILLING ---
        if ($request->hasFile('va_file')) {
            if ($dataRequest->va_file_path) {
                Storage::disk('local')->delete($dataRequest->va_file_path);
            }
            $dataRequest->va_file_path = $request->file('va_file')->store('private/billing');
            
            if ($request->status === 'waiting_payment') {
                $dataRequest->va_expired_at = now()->addDays(7);
            }
        }

        // --- 2. PROSES FILE HASIL DATA ---
        if ($request->hasFile('result_file')) {
            if ($dataRequest->result_file_path) {
                Storage::disk('local')->delete($dataRequest->result_file_path);
            }
            $dataRequest->result_file_path = $request->file('result_file')->store('private/results');
            
            if ($request->status === 'paid') {
                $dataRequest->download_expired_at = now()->addDays(3);
            }
        }

        // --- 3. UPDATE STATUS & CATATAN ---
        $dataRequest->status = $request->status;
        $dataRequest->admin_note = $request->admin_note;
        $dataRequest->save();

        // --- 4. LOG AKTIVITAS ---
        ActivityLog::create([
            'admin_id' => auth()->id(),
            'action' => 'update_request_status',
            'details' => json_encode([
                'ticket_code' => $dataRequest->ticket_code,
                'new_status'  => $dataRequest->status,
                'has_billing' => $dataRequest->va_file_path ? 'Ya' : 'Tidak',
                'has_result'  => $dataRequest->result_file_path ? 'Ya' : 'Tidak',
            ]),
        ]);

        return redirect()->back()->with('success', 'Status permohonan berhasil diperbarui.');
    }
}