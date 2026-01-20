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
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        // Ambil data berdasarkan rentang tanggal
        $reports = DataRequest::with('catalog')
            ->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59'])
            ->latest()
            ->get();
        
        // Hitung total tarif PNBP (Hanya yang statusnya sudah bayar/paid)
        $totalPnbp = $reports->where('status', 'paid')->sum(function($item) {
            return $item->catalog->price;
        });

        // Catat aksi cetak ke Log Aktivitas
        ActivityLog::record('print_report', [
            'periode' => $request->start_date . ' s/d ' . $request->end_date,
            'jumlah_data' => $reports->count()
        ]);

        // Generate PDF menggunakan view Blade (kita buat di langkah 4)
        $pdf = Pdf::loadView('pdf.report', [
            'reports' => $reports,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'total_pnbp' => $totalPnbp,
            'admin_name' => auth()->user()->name
        ])->setPaper('a4', 'landscape'); // Format landscape agar tabel muat banyak

        return $pdf->download('Laporan_PTSP_BMKG_' . $request->start_date . '.pdf');
    }
}