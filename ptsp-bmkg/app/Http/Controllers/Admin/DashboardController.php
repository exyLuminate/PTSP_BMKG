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
        // 1. Ambil data tren bulanan (Tetap sama, namun menggunakan selectRaw agar lebih bersih)
        $monthlyStats = DataRequest::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // 2. Ambil statistik semua status dalam satu query (Lebih cepat)
        $statusCounts = DataRequest::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        // 3. Susun paymentStats sesuai status baru yang ada di RequestDetail.jsx
        $paymentStats = [
            'on_process'         => $statusCounts['on_process'] ?? 0,
            'waiting_payment'    => $statusCounts['waiting_payment'] ?? 0,
            'verifikasi_payment' => $statusCounts['verifikasi_payment'] ?? 0,
            'paid'               => $statusCounts['paid'] ?? 0,
            'done'               => $statusCounts['done'] ?? 0,
            'expired'            => $statusCounts['expired'] ?? 0,
            'rejected'           => $statusCounts['rejected'] ?? 0,
        ];

        // 4. Ringkasan angka di atas dashboard
        $summary = [
            'total_requests' => DataRequest::count(),
            // Butuh Verifikasi = Berkas Baru (on_process) + Bukti Bayar Baru (verifikasi_payment)
            'pending_verification' => ($paymentStats['on_process'] + $paymentStats['verifikasi_payment']),
        ];

        return Inertia::render('Admin/Dashboard', [
            'monthlyStats' => $monthlyStats,
            'paymentStats' => $paymentStats,
            'summary'      => $summary,
        ]);
    }
}