<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\DataRequest;
use Illuminate\Support\Facades\DB;

class UpdateRequestStatus extends Command
{
    // Nama perintah yang dipanggil di terminal
    protected $signature = 'request:update-status';
    protected $description = 'Otomatisasi status Invalid (Billing) dan Expired (Download)';

    public function handle()
    {
        // 1. Cek Billing yang sudah lewat 7 hari
        $invalidated = DataRequest::where('status', 'waiting_payment')
            ->where('va_expired_at', '<', now())
            ->update(['status' => 'invalid']);

        // 2. Cek Link Download yang sudah lewat 3 hari
        $expired = DataRequest::whereIn('status', ['paid', 'done'])
    ->where('download_expired_at', '<', now())
    ->update(['status' => 'expired']);
            

        $this->info("Berhasil: {$invalidated} billing jadi invalid, {$expired} link jadi expired.");
    }
}