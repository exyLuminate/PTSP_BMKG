<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DataCatalog;
use App\Models\Request as DataRequest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Admin
        User::updateOrCreate(
            ['email' => 'admin@bmkg.go.id'],
            [
                'name' => 'Admin PTSP BMKG',
                'username' => 'admin_bmkg',
                'password' => Hash::make('password123'),
            ]
        );

        // 2. Buat Katalog Informasi dengan Kategori
        $catalogs = [
            [
                'category' => 'Informasi Meteorologi',
                'info_type' => 'Keperluan Klaim Asuransi',
                'unit' => 'per lokasi - per hari',
                'price' => 175000
            ],
            [
                'category' => 'Informasi Khusus Meteorologi',
                'info_type' => 'Kegiatan Olah Raga',
                'unit' => 'per lokasi - per hari',
                'price' => 100000
            ],
            [
                'category' => 'Informasi Khusus Meteorologi',
                'info_type' => 'Kegiatan Komersial Outdoor/Indoor',
                'unit' => 'per lokasi - per hari',
                'price' => 100000
            ],
            [
                'category' => 'Informasi Khusus Meteorologi',
                'info_type' => 'Data Radar Cuaca (per 10 menit)',
                'unit' => 'per lokasi - per hari',
                'price' => 70000
            ],
            [
                'category' => 'Jasa Konsultasi Meteorologi',
                'info_type' => 'Pendukung Kegiatan Proyek, Survey, dan Penelitian Komersial',
                'unit' => 'Per lokasi',
                'price' => 3750000
            ],
        ];

        foreach ($catalogs as $item) {
            DataCatalog::updateOrCreate(
                ['info_type' => $item['info_type']],
                [
                    'category' => $item['category'],
                    'unit' => $item['unit'],
                    'price' => $item['price']
                ]
            );
        }

        // Ambil satu ID katalog untuk relasi data dummy permohonan
        $defaultCatalogId = DataCatalog::first()->id;

        // 3. Buat Data Permohonan Dummy
        $sampleData = [
            [
                'ticket_code' => 'PTSP-2026-001',
                'name' => 'Budi Santoso',
                'nik' => '3201010101010001', 
                'status' => 'on_process',
                'month_offset' => 0,
            ],
            [
                'ticket_code' => 'PTSP-2026-002',
                'name' => 'Siti Aminah',
                'nik' => '3201010101010002',
                'status' => 'paid',
                'month_offset' => 1,
            ],
            [
                'ticket_code' => 'PTSP-2026-003',
                'name' => 'Andi Wijaya',
                'nik' => '3201010101010003',
                'status' => 'expired',
                'month_offset' => 2,
            ],
        ];

        foreach ($sampleData as $data) {
            DataRequest::create([
                'ticket_code' => $data['ticket_code'],
                'nik' => $data['nik'], // Akan terenkripsi otomatis jika Model sudah di-cast
                'access_password' => Hash::make('user123'),
                'name' => $data['name'],
                'email' => strtolower(str_replace(' ', '', $data['name'])) . '@example.com',
                'quantity' => rand(1, 3), // Contoh jumlah kejadian
                'description' => 'Permohonan data meteorologi untuk keperluan skripsi/penelitian.',
                'ktp_path' => 'private/ktp/dummy_ktp.pdf',
                'letter_path' => 'private/letter/dummy_surat.pdf',
                'data_catalog_id' => $defaultCatalogId,
                'status' => $data['status'],
                'created_at' => Carbon::now()->subMonths($data['month_offset']),
            ]);
        }
    }
}