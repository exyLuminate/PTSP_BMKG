import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function DetailStatus({ request_data }) {
    const [isVerified, setIsVerified] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        ticket: request_data.ticket_code,
        password: '',
    });

    const uploadForm = useForm({
        payment_proof: null,
    });

    const handleVerify = (e) => {
        e.preventDefault();
        post(route('status.verify_password'), {
            onSuccess: () => setIsVerified(true),
        });
    };

    const handleUploadProof = (e) => {
        e.preventDefault();
        uploadForm.post(route('status.upload_proof', request_data.ticket_code), {
            forceFormData: true,
            onSuccess: () => alert('Bukti bayar berhasil dikirim!'),
        });
    };

    const getProgressInfo = (status) => {
        switch (status) {
            case 'on_process': return { step: 1, label: 'Verifikasi Berkas' };
            case 'waiting_payment': return { step: 2, label: 'Menunggu Pembayaran' };
            case 'verifikasi_payment': return { step: 2, label: 'Cek Pembayaran' };
            case 'paid': return { step: 3, label: 'Lunas & Selesai' };
            case 'completed': return { step: 3, label: 'Selesai' };
            case 'rejected': return { step: 0, label: 'Permohonan Ditolak' };
            default: return { step: 1, label: 'Sedang Diproses' };
        }
    };

    const info = getProgressInfo(request_data.status);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
            <Head title={`Detail Tiket ${request_data.ticket_code}`} />

            {/* Modal Verifikasi Password */}
            {!isVerified && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl text-center">
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Verifikasi Akses</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 mb-8">Masukkan password dokumen Anda</p>
                        <form onSubmit={handleVerify} className="space-y-4">
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-5 px-8 text-center font-bold tracking-[0.3em]" placeholder="••••••" required />
                            {errors.password && <p className="text-red-500 text-[9px] font-black uppercase">{errors.password}</p>}
                            <button disabled={processing} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-blue-100">Buka Detail</button>
                        </form>
                    </div>
                </div>
            )}

            <div className={`max-w-4xl mx-auto transition-all duration-700 ${isVerified ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                
                <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    {/* Header & Progress Bar */}
                    <div className="p-12 border-b border-slate-50 bg-gradient-to-b from-slate-50/50 text-center">
                        <h1 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Status Permohonan</h1>
                        <div className={`text-4xl font-black uppercase tracking-tighter mb-8 leading-none ${request_data.status === 'rejected' ? 'text-red-600' : 'text-slate-900'}`}>
                            {info.label}
                        </div>
                        
                        <div className="flex justify-between items-center max-w-md mx-auto relative mt-16">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
                            <div 
                                className={`absolute top-1/2 left-0 h-1 z-0 transition-all duration-1000 ${request_data.status === 'rejected' ? 'bg-red-500' : 'bg-blue-600'}`} 
                                style={{ width: `${info.step > 0 ? (info.step - 1) * 50 : (request_data.status === 'rejected' ? 100 : 0)}%` }}
                            ></div>
                            
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm
                                        ${info.step >= s ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg' : 
                                          request_data.status === 'rejected' ? 'bg-red-50 text-red-200 border-2 border-red-100' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>
                                        
                                        {/* Icons Logic */}
                                        {s === 1 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>}
                                        {s === 2 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.051-.659-1.172-.879-1.172-2.303 0-3.182 1.172-.879 3.07-.879 4.242 0L15 8.818M3.75 21.75h16.5a2.25 2.25 0 0 0 2.25-2.25V4.5a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v15a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>}
                                        {s === 3 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                                    </div>
                                    <span className={`absolute -bottom-8 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-500
                                        ${info.step >= s ? 'text-blue-600' : 'text-slate-300'}`}>
                                        {s === 1 ? 'Permohonan' : s === 2 ? 'Pembayaran' : 'Selesai'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Kolom Kiri: Rincian Data */}
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-2">Jenis Informasi</label>
                                <p className="text-xl font-black text-slate-900 uppercase leading-tight">{request_data.catalog?.info_type}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-2">Total Bayar PNBP</label>
                                <p className="text-3xl font-black text-emerald-600">Rp {new Intl.NumberFormat('id-ID').format(request_data.catalog?.price * request_data.quantity)}</p>
                            </div>
                        </div>

                        {/* Kolom Kanan: ACTION CENTER USER */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6 "> Langkah Selanjutnya</h4>
                            
                            {/* CASE 1: DITOLAK (MENAMPILKAN CATATAN ADMIN) */}
                            {request_data.status === 'rejected' && (
                                <div className="space-y-6 animate-in fade-in duration-700">
                                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                                        <p className="text-[10px] font-black uppercase text-red-400 mb-2 tracking-widest">Alasan Penolakan:</p>
                                        <p className="text-sm font-medium text-red-50 leading-relaxed italic">
                                            "{request_data.admin_note || 'Tidak ada catatan tambahan dari admin.'}"
                                        </p>
                                    </div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-loose">
                                        Mohon periksa kembali berkas Anda atau hubungi admin jika alasan penolakan memerlukan penjelasan lebih lanjut.
                                    </p>
                                </div>
                            )}

                            {/* CASE 2: Menunggu Pembayaran */}
                            {request_data.status === 'waiting_payment' && (
                                <div className="space-y-6">
                                    <p className="text-sm font-medium opacity-80 leading-relaxed">Silakan unduh Kode Billing/VA dan lakukan pembayaran:</p>
                                    <FilePreview label="Dokumen Kode Billing (VA)" id={request_data.id} type="billing" password={data.password} />

                                    <form onSubmit={handleUploadProof} className="pt-6 border-t border-white/10 space-y-4">
                                        <label className="text-[10px] font-black uppercase text-slate-400 block">Unggah Bukti Pembayaran (PDF/JPG)</label>
                                        <input type="file" onChange={e => uploadForm.setData('payment_proof', e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white" required />
                                        <button disabled={uploadForm.processing} className="w-full bg-emerald-500 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition shadow-lg">Kirim Bukti Bayar</button>
                                    </form>
                                </div>
                            )}

                            {/* CASE 3: Selesai / Paid */}
                            {request_data.status === 'paid' && (
                                <div className="space-y-6 text-center">
                                    <p className="text-sm font-medium">Pembayaran Lunas! Silakan unduh hasil data Anda:</p>
                                    <FilePreview label="File Hasil Data Meteorologi" id={request_data.id} type="result" password={data.password} />
                                </div>
                            )}

                            {/* Status Lainnya */}
                            {request_data.status === 'on_process' && <p className="text-sm opacity-60 italic text-center py-10">Berkas sedang diverifikasi Admin...</p>}
                            {request_data.status === 'verifikasi_payment' && <p className="text-sm opacity-60 italic text-center py-10">Bukti bayar sedang dicek Bendahara...</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Komponen Preview PDF
function FilePreview({ label, id, type, password }) {
    const streamUrl = route('permohonan.file.stream', { id, type, password });
    return (
        <div className="group">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">{label}</p>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-inner">
                <iframe src={streamUrl} className="w-full h-40" title={label}></iframe>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={streamUrl} target="_blank" className="bg-white text-slate-900 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest">Buka PDF ↗</a>
                </div>
            </div>
        </div>
    );
}