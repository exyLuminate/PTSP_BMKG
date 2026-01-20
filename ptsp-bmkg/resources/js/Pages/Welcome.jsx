import React from 'react';
import { Head, Link } from '@inertiajs/react';

const LandingPage = () => {
    // Data tarif berdasarkan tabel di dokumen 
    const tariffs = [
        { info: 'Informasi Meteorologi untuk Keperluan Klaim Asuransi', unit: 'per lokasi - per hari', price: 'Rp. 175.000' },
        { info: 'Informasi Cuaca Khusus untuk Kegiatan Olah Raga', unit: 'per lokasi - per hari', price: 'Rp. 100.000' },
        { info: 'Informasi Cuaca Khusus untuk Kegiatan Komersial Outdoor/Indoor', unit: 'per lokasi - per hari', price: 'Rp. 100.000' },
        { info: 'Data Radar Cuaca (per 10 menit)', unit: 'per lokasi - per hari', price: 'Rp. 70.000' },
        { info: 'Jasa Konsultasi Meteorologi: Informasi Meteorologi Khusus untuk Pendukung Kegiatan Proyek, Survey, dan Penelitian Komersial', unit: 'Per lokasi', price: 'Rp. 3.750.000' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Head title="PTSP BMKG - Beranda" />

            {/* Hero Sectio*/}
            <header className="bg-[#1e3a8a] text-white py-16 px-6 text-center shadow-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Sistem Informasi PTSP BMKG</h1>
                <p className="text-xl md:text-2xl mb-10 text-blue-100">Stasiun Meteorologi Radin Inten II</p>
                
                {/* Dua Tombol Utama  */}
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    <Link 
                        href="/permohonan" 
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-xl shadow-md transition-all transform hover:scale-105"
                    >
                        Permintaan Data
                    </Link>
                    <Link 
                        href="/tracking" 
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-10 rounded-xl shadow-md transition-all transform hover:scale-105"
                    >
                        Pengecekan Data
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto py-12 px-6">
                {/* Informasi Jam Operasional & Panduan*/}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-amber-50 p-8 rounded-2xl border border-amber-200 flex items-start space-x-4 shadow-sm">
                        <div className="text-amber-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-amber-900 mb-2">Jam Operasional</h2>
                            <p className="text-amber-800 font-medium text-lg">Senin - Jumat: 08:00 - 16:00 WIB</p>
                            <p className="text-sm mt-3 text-amber-700 leading-relaxed italic">
                                *Sistem tetap dapat menerima permohonan kapan saja, namun pengecekan tiket hanya diproses pada jam kerja.</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-8 rounded-2xl border border-blue-200 flex items-start space-x-4 shadow-sm">
                        <div className="text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-blue-900 mb-2">Panduan Penggunaan</h2>
                            <p className="text-blue-800 mb-4 text-lg">Pelajari tata cara pengajuan data melalui dokumen resmi kami.</p>
                            <a 
                                href="/files/panduan_ptsp.pdf" 
                                download 
                                className="inline-flex items-center text-blue-700 font-bold hover:text-blue-900 underline decoration-2 underline-offset-4"
                            >
                                Unduh PDF Panduan
                            </a>
                        </div>
                    </div>
                </div>

                {/* Tabel Tarif */}
                <section className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gray-50 p-8 border-b border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800">Daftar Informasi & Tarif</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 uppercase text-sm tracking-wider">
                                    <th className="p-6 font-bold border-b">Jenis Informasi</th>
                                    <th className="p-6 font-bold border-b text-center">Satuan</th>
                                    <th className="p-6 font-bold border-b text-right">Tarif</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tariffs.map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="p-6 text-gray-700 font-medium leading-relaxed">{item.info}</td>
                                        <td className="p-6 text-gray-600 text-center italic">{item.unit}</td>
                                        <td className="p-6 font-bold text-right text-blue-700 text-lg whitespace-nowrap">{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* Footer Sederhana */}
            <footer className="mt-12 py-8 bg-gray-100 text-center text-gray-500 text-sm border-t border-gray-200">
                &copy; 2026 Stasiun Meteorologi Radin Inten II - BMKG.
            </footer>
        </div>
    );
};

export default LandingPage;