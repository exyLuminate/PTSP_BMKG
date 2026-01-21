import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function SuccessPermohonan({ ticket_code }) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans">
            <Head title="Permohonan Berhasil" />
            
            <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl p-12 text-center border border-slate-100">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-[2rem] bg-emerald-50 mb-8 text-emerald-500">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Berhasil Terkirim!</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">Simpan kode tiket Anda untuk cek status</p>

                <div className="bg-slate-50 rounded-[2rem] p-8 mb-10 border border-slate-100 shadow-inner">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">Kode Tiket</span>
                    <p className="text-3xl font-black tracking-widest">{ticket_code}</p>
                </div>

                <div className="space-y-4">
                    <a 
                        href={route('permohonan.download_proof', { ticket: ticket_code })}
                        className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-6 rounded-[1.5rem] shadow-xl shadow-blue-200 transition-all uppercase text-[10px] tracking-widest"
                    >
                        Download Bukti Pendaftaran (PDF)
                    </a>

                    <Link 
                        href="/" 
                        className="block w-full text-slate-400 hover:text-blue-600 font-black py-4 uppercase text-[10px] tracking-widest transition-colors"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}