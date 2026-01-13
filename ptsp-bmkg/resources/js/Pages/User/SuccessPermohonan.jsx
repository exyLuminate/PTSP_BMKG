import React from 'react';
import { Head, Link } from '@inertiajs/react';

const SuccessPermohonan = ({ ticket_code, password }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <Head title="Permohonan Berhasil" />
            
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
                {/* Icon Success */}
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Permohonan Terkirim!</h2>
                <p className="text-gray-500 mb-8">Silakan simpan data di bawah ini untuk melacak status permintaan Anda.</p>

                {/* Info Tiket & Password */}
                <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100 space-y-4">
                    <div>
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Kode Tiket</span>
                        <p className="text-2xl font-mono font-black text-blue-900 tracking-wider">{ticket_code}</p>
                    </div>
                    <div className="border-t border-blue-200 pt-4">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Password Akses</span>
                        <p className="text-lg font-semibold text-blue-900">{password}</p>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="space-y-4">
                    {/* Tombol Cetak PDF sesuai aturan bisnis */}
                    <a 
                        href={`/permohonan/download-bukti/${ticket_code}`}
                        className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 2v3.586a1 1 0 001 1H15L11 4z" />
                        </svg>
                        Cetak Bukti Permohonan (PDF)
                    </a>

                    <Link 
                        href="/" 
                        className="block w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>

                <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-xs text-amber-700 leading-relaxed italic">
                        <strong>Penting:</strong> Simpan Kode Tiket dan Password ini. Sistem tidak mengirimkan notifikasi via email. 
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SuccessPermohonan;