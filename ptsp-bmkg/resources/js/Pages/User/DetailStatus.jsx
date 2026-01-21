import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function DetailStatus({ request_data }) {
    const [isVerified, setIsVerified] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        ticket: request_data.ticket_code,
        password: '',
    });

    const handleVerify = (e) => {
        e.preventDefault();
        post(route('status.verify_password'), {
            onSuccess: () => setIsVerified(true),
        });
    };

    // Fungsi untuk memetakan alur 7 status ke progress bar (3 tahapan besar)
    const getProgressInfo = (status) => {
        switch (status) {
            case 'on_process': 
                return { step: 1, label: 'Proses Verifikasi Berkas' };
            case 'waiting_payment': 
                return { step: 2, label: 'Menunggu Pembayaran' };
            case 'verifikasi_payment': 
                return { step: 2, label: 'Verifikasi Pembayaran' };
            case 'paid': 
                return { step: 3, label: 'Pembayaran Lunas' };
            case 'completed': 
                return { step: 3, label: 'Selesai' };
            case 'rejected': 
                return { step: 0, label: 'Permohonan Ditolak' };
            case 'expired': 
                return { step: 0, label: 'Tagihan Kadaluwarsa' };
            default: 
                return { step: 1, label: 'Sedang Diproses' };
        }
    };

    const info = getProgressInfo(request_data.status);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
            <Head title={`Detail Tiket ${request_data.ticket_code}`} />

            {/* Modal Verifikasi Password */}
            {!isVerified && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl border border-slate-100 text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Verifikasi Akses</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 mb-8">Masukkan password dokumen Anda</p>

                        <form onSubmit={handleVerify} className="space-y-4">
                            <input 
                                type="password" 
                                value={data.password} 
                                onChange={e => setData('password', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-8 focus:ring-4 focus:ring-blue-500/10 font-bold text-center tracking-[0.3em]"
                                placeholder="••••••"
                                required 
                            />
                            {errors.password && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest">{errors.password}</p>}
                            <button disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all uppercase text-[10px] tracking-widest">
                                Buka Detail
                            </button>
                            <Link href={route('status.index')} className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pt-4">Batal</Link>
                        </form>
                    </div>
                </div>
            )}

            {/* Konten Detail */}
            <div className={`max-w-4xl mx-auto transition-all duration-700 ${isVerified ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <div className="flex justify-between items-center mb-8">
                    <Link href={route('status.index')} className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                        Kembali ke Daftar
                    </Link>
                    <div className="flex gap-3">
                        <span className="bg-white px-6 py-2 rounded-full border border-slate-100 text-[10px] font-black text-blue-600 shadow-sm uppercase tracking-widest italic">{request_data.ticket_code}</span>
                    </div>
                </div>

                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-blue-100/30 border border-slate-100 overflow-hidden">
                    {/* Header Status Dinamis */}
                    <div className="p-12 border-b border-slate-50 bg-gradient-to-b from-slate-50/50 to-white text-center">
                        <h1 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Status Permohonan</h1>
                        <div className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-none">{info.label}</div>
                        
                        {/* Progress Bar */}
                        <div className="flex justify-between items-center max-w-md mx-auto relative mt-12">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
                            <div className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-1000" style={{ width: `${info.step > 0 ? (info.step - 1) * 50 : 0}%` }}></div>
                            
                            {[1, 2, 3].map((s) => (
                                <div key={s} className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] transition-all duration-500 ${info.step >= s ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>
                                    {s === 1 ? 'P' : s === 2 ? 'B' : 'S'}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Kolom Kiri: Rincian Data */}
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-2">Jenis Informasi</label>
                                <p className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{request_data.catalog?.info_type}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-2">Biaya PNBP (Harga Asli)</label>
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-2">
                                        <span>Rp {new Intl.NumberFormat('id-ID').format(request_data.catalog?.price)} x {request_data.quantity}</span>
                                        <span className="text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(request_data.catalog?.price * request_data.quantity)}</span>
                                    </div>
                                    <div className="h-px bg-slate-200 my-3"></div>
                                    <div className="flex justify-between items-center font-black uppercase italic">
                                        <span className="text-[9px] text-blue-600">Total Bayar</span>
                                        <span className="text-xl text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(request_data.catalog?.price * request_data.quantity)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Instruksi sesuai Status */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6 italic">// Langkah Selanjutnya</h4>
                            
                            {request_data.status === 'on_process' && (
                                <div className="space-y-4">
                                    <p className="text-sm font-medium leading-relaxed opacity-80">Admin sedang memverifikasi berkas KTP dan Surat Permohonan Anda. Mohon tunggu maksimal 1x24 jam kerja.</p>
                                    <div className="pt-4 border-t border-white/10 text-[9px] uppercase font-black tracking-widest text-slate-500">Estimasi Selesai: Hari ini / Besok</div>
                                </div>
                            )}

                            {request_data.status === 'waiting_payment' && (
                                <div className="space-y-6">
                                    <p className="text-sm font-medium leading-relaxed">Berkas Anda valid. Silakan lakukan pembayaran PNBP menggunakan Kode Billing di bawah ini:</p>
                                    <div className="bg-white/10 p-5 rounded-2xl text-center border border-white/10">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-300 block mb-1">Kode Billing / VA</span>
                                        <span className="text-2xl font-black tracking-widest">{request_data.billing_code || 'SEDANG DIBUAT'}</span>
                                    </div>
                                    <button className="w-full bg-blue-600 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/50">Upload Bukti Bayar</button>
                                </div>
                            )}

                            {request_data.status === 'verifikasi_payment' && (
                                <p className="text-sm font-medium leading-relaxed italic opacity-80 text-center py-4">Pembayaran Anda sedang diverifikasi oleh bendahara. Data akan dikirimkan segera setelah lunas.</p>
                            )}

                            {request_data.status === 'paid' && (
                                <div className="space-y-6 text-center">
                                    <p className="text-sm font-medium leading-relaxed">Pembayaran lunas! Silakan unduh hasil data Anda melalui tombol di bawah ini.</p>
                                    <a href="#" className="flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 p-5 rounded-2xl text-white transition-all shadow-xl shadow-emerald-900/20">
                                        <span className="font-black text-[10px] uppercase tracking-widest">Unduh Data Meteorologi</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 11.25 12 15.75m0 0 4.5-4.5M12 15.75V3" /></svg>
                                    </a>
                                </div>
                            )}

                            {request_data.status === 'rejected' && (
                                <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 text-center">
                                    <p className="text-sm font-bold text-red-400">Permohonan Ditolak</p>
                                    <p className="text-[10px] mt-2 opacity-60">Alasan: Berkas dokumen tidak terbaca atau tidak sesuai ketentuan (Max 4MB).</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}