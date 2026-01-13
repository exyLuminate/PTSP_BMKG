import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

const FormPermohonan = ({ katalog }) => {
    // Menggunakan helper useForm dari Inertia untuk menangani input dan file
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        email: '',
        nik: '', // NIK akan dienkripsi di backend 
        data_catalog_id: '',
        description: '',
        password: '', // Password dibuat user untuk akses tracking nanti [cite: 17, 98]
        ktp: null,
        surat_permohonan: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/permohonan/store'); // Endpoint untuk simpan data
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <Head title="Form Permintaan Data" />
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-900 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold">Formulir Permintaan Data</h2>
                    <p className="text-blue-200 text-sm">Isi data di bawah ini dengan lengkap</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Data Diri */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                            <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
                        <input type="text" value={data.nik} onChange={e => setData('nik', e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="16 digit NIK" required />
                    </div>

                    {/* Jenis Data dari Katalog */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Data yang Diminta</label>
                        <select value={data.data_catalog_id} onChange={e => setData('data_catalog_id', e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
                            <option value="">Pilih Jenis Informasi...</option>
                            {/* Data ini nanti dikirim dari controller [cite: 196] */}
                            <option value="1">Info Meteorologi Asuransi - Rp 175.000</option>
                            <option value="2">Data Radar Cuaca - Rp 70.000</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Permintaan</label>
                        <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" rows="3" placeholder="Contoh: Data curah hujan bulan Januari 2024 di wilayah..."></textarea>
                    </div>

                    {/* Upload Berkas - Wajib PDF Max 2MB [cite: 25, 38, 117] */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Upload KTP (PDF, Max 2MB)</label>
                            <input type="file" onChange={e => setData('ktp', e.target.files[0])} accept=".pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Surat Permohonan (PDF, Max 2MB)</label>
                            <input type="file" onChange={e => setData('surat_permohonan', e.target.files[0])} accept=".pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
                        </div>
                    </div>

                    {/* Password untuk Akses Tracking [cite: 17, 24] */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <label className="block text-sm font-bold text-blue-900 mb-1">Buat Password Akses</label>
                        <p className="text-xs text-blue-700 mb-2 italic">*Penting: Password ini digunakan bersama Kode Tiket untuk melihat status data Anda nanti.</p>
                        <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full border-blue-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={processing} className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg disabled:opacity-50">
                            {processing ? 'Sedang Mengirim...' : 'Kirim Permohonan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormPermohonan;