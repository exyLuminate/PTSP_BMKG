<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
{
    // Hapus atau comment baris "Test User" bawaan Laravel jika ada
    
    // Buat Akun Admin Utama sesuai dokumen
    \App\Models\User::create([
        'name' => 'Admin PTSP BMKG',
        'username' => 'admin_bmkg', // Username yang wajib diisi
        'email' => 'admin@bmkg.go.id',
        'password' => \Illuminate\Support\Facades\Hash::make('password123'),
    ]);

    // Tambahkan Katalog Data agar Admin punya data untuk dikelola [cite: 64-68]
    \App\Models\DataCatalog::create([
        'info_type' => 'Data Meteorologi Radius 50km',
        'unit' => 'Per-lokasi/hari',
        'price' => 250000.00
    ]);
}
}
