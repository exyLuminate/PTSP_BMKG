<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Request as DataRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RequestManagementController extends Controller
{
    public function index(Request $request)
    {
        // Query dasar dengan relasi ke katalog informasi [cite: 83, 87]
        $query = DataRequest::with('catalog');

        // Fitur Pencarian berdasarkan NIK atau Kode Tiket 
        if ($request->search) {
            $query->where('ticket_code', 'like', '%' . $request->search . '%')
                  ->orWhere('nik', $request->search); // NIK akan otomatis terdekripsi saat dicari karena 'casts' di Model
        }

        // Fitur Filter berdasarkan Status 
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

    $validated = $request->validate([
        'status' => 'required|in:on_process,ready,paid,expired,rejected',
        'va_number' => 'nullable|string',
        'admin_note' => 'nullable|string',
        'result_file' => 'nullable|file|mimes:pdf,zip,xlsx,csv|max:10240', // Max 10MB
    ]);

    // Logika VA Expired 1x24 Jam
    if ($validated['status'] === 'ready' && $request->va_number) {
        $validated['va_expired_at'] = now()->addHours(24);
    }

    // Logika Upload Hasil Data
    if ($request->hasFile('result_file')) {
        // Simpan di folder private agar tidak bisa diakses publik secara langsung
        $path = $request->file('result_file')->store('private/results');
        $validated['result_file_path'] = $path;
    }

    $dataRequest->update($validated);

    return redirect()->back()->with('success', 'Data berhasil diperbarui.');
}
}
