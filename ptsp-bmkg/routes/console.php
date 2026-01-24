<?php

use App\Models\DataRequest; // Pastikan import sesuai nama model kamu
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;

// Task Scheduler: Berjalan setiap jam (lebih hemat resource dibanding everyMinute)
Schedule::call(function () {
    
    // 1. Billing Lewat 7 Hari -> Jadi INVALID
    $invalidated = DataRequest::where('status', 'waiting_payment')
        ->where('va_expired_at', '<', now())
        ->update(['status' => 'invalid']);

    if ($invalidated > 0) {
        Log::info("Scheduler: $invalidated billing telat bayar diubah ke INVALID.");
    }

    // 2. Link Unduh Lewat 3 Hari -> Jadi EXPIRED (Bukan DONE)
    // Done itu kalau dia SUKSES download. Kalau telat, namanya EXPIRED.
    $expired = DataRequest::where('status', 'paid')
        ->where('download_expired_at', '<', now())
        ->update(['status' => 'expired']);

    if ($expired > 0) {
        Log::info("Scheduler: $expired link unduh hangus diubah ke EXPIRED.");
    }

})->hourly();