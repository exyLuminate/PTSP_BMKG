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

                <div className="bg-amber-50/50 border border-amber-100 rounded-[2rem] p-6 mb-10 text-left">
                    <div className="flex items-center gap-3 mb-3">
                        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Informasi Penting</span>
                    </div>
                    <ul className="space-y-3 text-slate-600 text-[11px] font-medium leading-relaxed">
                        <li className="flex gap-2">
                            <span className="text-amber-500">•</span>
                        <span>
                            Data hasil permohonan akan tersedia <b>paling lambat 3 hari kerja</b> 
                            <span className="text-slate-400"> (Sabtu, Minggu, & hari libur nasional tidak dihitung)</span>. 
                            Harap cek status tiket secara berkala.
                        </span>                       
                        </li>
                        <li className="flex gap-2">
                            <span className="text-amber-500">•</span>
                            <span>Segera lakukan pembayaran setelah Kode Billing muncul.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-amber-500">•</span>
                            <span>Jika lewat 7 hari, Anda wajib <b>meminta ulang Kode Billing</b> melalui halaman Cek Status.</span>
                        </li>
                    </ul>
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