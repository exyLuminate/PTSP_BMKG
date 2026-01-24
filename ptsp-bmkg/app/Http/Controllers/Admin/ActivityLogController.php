<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    /**
     * Menampilkan daftar log aktivitas admin
     */
    public function index()
    {
        return Inertia::render('Admin/ActivityLogList', [
            'logs' => ActivityLog::with('user') // Eager loading data admin
                ->latest() // Urutkan dari yang terbaru
                ->paginate(10) // Batasi 10 data per halaman
        ]);
    }
}