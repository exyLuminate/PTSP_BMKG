<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Request as DataRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Tren bulanan untuk Bar Chart
        $monthlyStats = DataRequest::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // 2. Statistik Status untuk Pie Chart
        $statusCounts = DataRequest::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $paymentStats = [
            'on_process'         => $statusCounts['on_process'] ?? 0,
            'waiting_payment'    => $statusCounts['waiting_payment'] ?? 0,
            'verifikasi_payment' => $statusCounts['verifikasi_payment'] ?? 0,
            'paid'               => $statusCounts['paid'] ?? 0,
            'done'               => $statusCounts['done'] ?? 0,
            'expired'            => $statusCounts['expired'] ?? 0,
            'rejected'           => $statusCounts['rejected'] ?? 0,
        ];

        // 3. HITUNG TOTAL PNBP (KUMULATIF SEMUA WAKTU)
        
        $yearlyPnbp = DataRequest::whereIn('status', ['paid', 'done'])
            ->whereYear('requests.created_at', date('Y')) // Filter tahun sekarang
            ->join('data_catalogs', 'requests.data_catalog_id', '=', 'data_catalogs.id') 
            ->sum(DB::raw('data_catalogs.price * requests.quantity'));

        // 4. HITUNG PNBP KHUSUS BULAN INI
        // Menggunakan whereMonth dan whereYear untuk memfilter data di Januari 2026
        $monthlyPnbp = DataRequest::whereIn('status', ['paid', 'done'])
            ->whereMonth('requests.created_at', date('m'))
            ->whereYear('requests.created_at', date('Y'))
            ->join('data_catalogs', 'requests.data_catalog_id', '=', 'data_catalogs.id') 
            ->sum(DB::raw('data_catalogs.price * requests.quantity'));

        // 5. AMBIL 5 AKTIVITAS TERKINI
        $recentRequests = DataRequest::with('catalog')
            ->latest()
            ->take(5)
            ->get();

        // 6. Ringkasan angka dashboard
        $summary = [
            'total_requests'       => DataRequest::count(),
            'pending_verification' => ($paymentStats['on_process'] + $paymentStats['verifikasi_payment']),
            'yearly_pnbp'          => $yearlyPnbp,
            'monthly_pnbp'         => $monthlyPnbp, // Data baru untuk Frontend
        ];

        return Inertia::render('Admin/Dashboard', [
            'monthlyStats'   => $monthlyStats,
            'paymentStats'   => $paymentStats,
            'summary'        => $summary,
            'recentRequests' => $recentRequests,
        ]);
    }
}