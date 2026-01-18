<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up() {
        Schema::table('requests', function (Blueprint $table) {
            // Kolom Dokumen PDF Baru
            
        
            // Mengubah Enum Status agar sesuai Workflow terbaru
            $table->enum('status', [
                'on_process',           // Verifikasi berkas
                'waiting_payment',      // Menunggu bayar (Admin sudah upload VA)
                'verifikasi_payment',   // User sudah upload bukti bayar
                'paid',                 // Pembayaran sah (Akses unduh terbuka)
                'expired',              // Melebihi batas waktu
                'done',                 // Selesai (Akses ditutup)
                'rejected'              // Ditolak
            ])->default('on_process')->change();
        });
    }

    public function down() {
        Schema::table('requests', function (Blueprint $table) {
            $table->dropColumn(['va_file_path', 'payment_proof_path', 'va_expired_at', 'download_expired_at']);
        });
    }
};