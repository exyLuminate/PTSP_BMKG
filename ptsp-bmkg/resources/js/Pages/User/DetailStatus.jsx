import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function DetailStatus({ request_data }) {
    const { data, setData, post, processing } = useForm({
        payment_proof: null,
    });

    const handleUploadProof = (e) => {
        e.preventDefault();
        post(route('status.upload_proof', { ticket: request_data.ticket_code }));
    };

    const statusInfo = {
        on_process: { label: 'Verifikasi Berkas', desc: 'Admin sedang memeriksa kelengkapan dokumen Anda.', color: 'text-amber-600', bg: 'bg-amber-50' },
        waiting_payment: { label: 'Menunggu Pembayaran', desc: 'Silakan lakukan pembayaran ke nomor Virtual Account di bawah.', color: 'text-blue-600', bg: 'bg-blue-50' },
        verifikasi_payment: { label: 'Proses Verifikasi Bayar', desc: 'Bukti bayar Anda sedang divalidasi oleh bendahara.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        paid: { label: 'Lunas & Siap Unduh', desc: 'Pembayaran terverifikasi. Data sudah dapat Anda unduh.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        rejected: { label: 'Permohonan Ditolak', desc: `Mohon maaf, permohonan ditolak: ${request_data.admin_note}`, color: 'text-red-600', bg: 'bg-red-50' },
    };

    const currentStatus = statusInfo[request_data.status] || { label: request_data.status, desc: '', color: 'text-slate-600', bg: 'bg-slate-50' };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 text-slate-900">
            <Head title={`Detail Tiket ${request_data.ticket_code}`} />
            
            <div className="max-w-3xl mx-auto mb-6">
                <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Kembali ke Daftar Tiket
                </button>
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className={`p-10 ${currentStatus.bg} border-b border-slate-100`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Kode Tiket</span>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{request_data.ticket_code}</h2>
                        </div>
                        <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-white shadow-sm ${currentStatus.color}`}>
                            {currentStatus.label}
                        </span>
                    </div>
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-tight">{currentStatus.desc}</p>
                </div>

                <div className="p-10 space-y-8">
                    {/* INFO LAYANAN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-50">
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Jenis Informasi</h4>
                            <p className="font-bold text-slate-900">{request_data.catalog?.info_type}</p>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tarif PNBP</h4>
                            <p className="font-black text-blue-600 text-xl">Rp {new Intl.NumberFormat('id-ID').format(request_data.catalog?.price)}</p>
                        </div>
                    </div>

                    {/* LOGIC INTERAKTIF BERDASARKAN STATUS */}
                    {request_data.status === 'waiting_payment' && (
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Instruksi Pembayaran</h4>
                            <div className="mb-6">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Nomor Virtual Account / Kode Billing</p>
                                <p className="text-2xl font-black tracking-[0.1em]">{request_data.va_number || 'SEDANG DISIAPKAN'}</p>
                            </div>
                            
                            <form onSubmit={handleUploadProof} className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Upload Bukti Bayar (PDF/JPG, Max 4MB)</label>
                                <input type="file" onChange={e => setData('payment_proof', e.target.files[0])} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white cursor-pointer" />
                                <button disabled={processing} className="w-full bg-blue-600 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all">
                                    {processing ? 'MENGUNGGAH...' : 'KIRIM BUKTI PEMBAYARAN'}
                                </button>
                            </form>
                        </div>
                    )}

                    {request_data.status === 'paid' && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8 text-center">
                            <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-4">Data Sudah Tersedia</h4>
                            <a href={route('file.download.user', { ticket: request_data.ticket_code, type: 'result' })} className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-10 rounded-2xl shadow-lg shadow-emerald-100 transition-all uppercase text-[10px] tracking-widest">
                                DOWNLOAD DATA SEKARANG
                            </a>
                            <p className="text-[9px] text-emerald-500 font-bold mt-4 uppercase tracking-tighter italic">Link unduh akan kadaluwarsa pada: {new Date(request_data.download_expired_at).toLocaleString('id-ID')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}