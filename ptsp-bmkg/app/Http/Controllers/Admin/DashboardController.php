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
        // Ambil data per bulan untuk tahun ini [cite: 134, 188, 238]
        $monthlyStats = DataRequest::select(
                DB::raw('MONTH(created_at) as month'), 
                DB::raw('count(*) as total')
            )
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Statistik perbandingan status untuk Pie Chart [cite: 135, 190-191, 239]
        $paymentStats = [
            'paid' => DataRequest::where('status', 'paid')->count(),
            'expired' => DataRequest::where('status', 'expired')->count(),
            'on_process' => DataRequest::where('status', 'on_process')->count(),
            'ready' => DataRequest::where('status', 'ready')->count(),
        ];

        // Ringkasan angka di atas dashboard
        $summary = [
            'total_requests' => DataRequest::count(),
            'pending_verification' => DataRequest::where('status', 'on_process')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'monthlyStats' => $monthlyStats,
            'paymentStats' => $paymentStats,
            'summary' => $summary,
        ]);
    }
}