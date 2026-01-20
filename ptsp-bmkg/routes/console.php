<?php

use App\Models\Request as DataRequest;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;

// Task Scheduler: Berjalan setiap menit
Schedule::call(function () {
    
    // 1. Menangani VA Expired (7 Hari)
    $expiredVa = DataRequest::where('status', 'waiting_payment')
        ->where('va_expired_at', '<', now())
        ->update(['status' => 'expired']);

    if ($expiredVa > 0) {
        Log::info("Scheduler: Berhasil mengubah $expiredVa permohonan menjadi EXPIRED.");
    }

    // 2. Menangani Batas Waktu Unduh (3 Hari)
    $doneRequests = DataRequest::where('status', 'paid')
        ->where('download_expired_at', '<', now())
        ->update(['status' => 'done']);

    if ($doneRequests > 0) {
        Log::info("Scheduler: Berhasil mengubah $doneRequests permohonan menjadi DONE.");
    }

})->everyMinute();