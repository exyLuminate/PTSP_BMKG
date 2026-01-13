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
}
