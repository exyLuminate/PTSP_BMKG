<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Request as DataRequest;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    // Menampilkan halaman filter laporan
    public function index()
    {
        return Inertia::render('Admin/ReportPage');
    }

    // Fungsi untuk proses download PDF
    public function download(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'status'     => 'nullable|string', // Validasi status opsional
        ]);

        // 1. Inisialisasi Query
        $query = DataRequest::with('catalog')
            ->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);

        // 2. Filter berdasarkan Status (Jika dipilih)
        // Ini akan menangkap status 'invalid', 'paid', 'done', dll dari frontend
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $reports = $query->oldest()->get();
        
        // 3. Hitung total tarif PNBP 
        // Logika: Hanya hitung dari permohonan yang statusnya 'paid' atau 'done'
        // Meskipun filternya 'invalid', total PNBP akan tetap 0 secara otomatis
        $totalPnbp = $reports->filter(function($item) {
            return in_array($item->status, ['paid', 'done']);
        })->sum(function($item) {
            return $item->catalog->price ?? 0;
        });

        // 4. Catat ke Log Aktivitas
        ActivityLog::record('print_report', [
            'periode'     => $request->start_date . ' s/d ' . $request->end_date,
            'filter_status' => $request->status ?? 'Semua',
            'jumlah_data' => $reports->count(),
            'total_pnbp'  => $totalPnbp
        ]);

        // 5. Generate PDF
        $pdf = Pdf::loadView('pdf.report', [
            'reports'    => $reports,
            'start_date' => $request->start_date,
            'end_date'   => $request->end_date,
            'status'     => $request->status,
            'total_pnbp' => $totalPnbp,
            'admin_name' => auth()->user()->name
        ])->setPaper('a4', 'landscape');

        $filename = 'Laporan_PTSP_BMKG_' . ($request->status ?? 'All') . '_' . $request->start_date . '.pdf';
        
        return $pdf->download($filename);
    }
}