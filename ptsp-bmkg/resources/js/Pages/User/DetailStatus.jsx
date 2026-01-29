import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function DetailStatus({ request_data }) {
    const [isVerified, setIsVerified] = useState(false);
    
    // Form Verifikasi Password Akses
    const { data, setData, post, processing, errors } = useForm({
        ticket: request_data.ticket_code,
        password: '',
    });

    // Form Upload Bukti Bayar
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

    const getProgressInfo = (status, adminNote) => {
        switch (status) {
            case 'on_process': 
                if (adminNote === 'User meminta ulang kode billing karena expired.') {
                    return { step: 1, label: 'Menunggu Billing Baru' };
                }
                return { step: 1, label: 'Verifikasi Berkas' };            
            case 'waiting_payment': return { step: 2, label: 'Menunggu Pembayaran' };
            case 'invalid': return { step: 2, label: 'Billing Kedaluwarsa' };
            case 'verifikasi_payment': return { step: 2, label: 'Cek Pembayaran' };
            case 'paid': return { step: 3, label: 'Lunas (Siap Unduh)' };
            case 'done': return { step: 3, label: 'Selesai' };
            case 'expired': return { step: 3, label: 'Masa Unduh Habis' };
            case 'rejected': return { step: 0, label: 'Permohonan Ditolak' };
            default: return { step: 1, label: 'Sedang Diproses' };
        }
    };

    const info = getProgressInfo(request_data.status, request_data.admin_note);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
            <Head title={`Detail Tiket ${request_data.ticket_code}`} />

            {/* Modal Verifikasi Password */}
            {!isVerified && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl text-center border border-slate-100">
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Verifikasi Akses</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 mb-8">Masukkan password dokumen Anda</p>
                        <form onSubmit={handleVerify} className="space-y-4">
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-5 px-8 text-center font-bold tracking-[0.3em]" placeholder="••••••" required />
                            {errors.password && <p className="text-red-500 text-[9px] font-black uppercase">{errors.password}</p>}
                            <button disabled={processing} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg hover:bg-blue-700 transition-all">Buka Detail</button>
                        </form>
                    </div>
                </div>
            )}

            <div className={`max-w-4xl mx-auto transition-all duration-700 ${isVerified ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                
                {/* Back Button */}
                <div className="mb-8">
                    <button onClick={() => window.history.back()} className="inline-flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-all group">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                        Kembali
                    </button>
                </div>

                <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    {/* Header & Progress Bar */}
                    <div className="p-12 border-b border-slate-50 bg-gradient-to-b from-slate-50/50 text-center">
                        <h1 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Status Permohonan</h1>
                        <div className={`text-4xl font-black uppercase tracking-tighter mb-8 leading-none ${['rejected', 'invalid', 'expired'].includes(request_data.status) ? 'text-red-600' : 'text-slate-900'}`}>
                            {info.label}
                        </div>
                        
                        {/* Progress Bar Visual */}
                        <div className="flex justify-between items-center max-w-md mx-auto relative mt-16">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
                            <div 
                                className={`absolute top-1/2 left-0 h-1 z-0 transition-all duration-1000 ${request_data.status === 'rejected' ? 'bg-red-500' : 'bg-blue-600'}`} 
                                style={{ width: `${info.step > 0 ? (info.step - 1) * 50 : (request_data.status === 'rejected' ? 100 : 0)}%` }}
                            ></div>
                            
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm
                                        ${info.step >= s ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>
                                        {s === 1 && <IconPermohonan />}
                                        {s === 2 && <IconPembayaran />}
                                        {s === 3 && <IconSelesai />}
                                    </div>
                                    <span className={`absolute -bottom-8 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-500 ${info.step >= s ? 'text-blue-600' : 'text-slate-300'}`}>
                                        {s === 1 ? 'Permohonan' : s === 2 ? 'Pembayaran' : 'Selesai'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Kolom Kiri: Detail Informasi */}
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-2">Tiket Kode</label>
                                <p className="text-xl font-black text-slate-900">{request_data.ticket_code}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-2">Jenis Informasi</label>
                                <p className="text-xl font-black text-slate-900 uppercase leading-tight">{request_data.catalog?.info_type}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-2">Total PNBP</label>
                                <p className="text-3xl font-black text-emerald-600">Rp {new Intl.NumberFormat('id-ID').format(request_data.catalog?.price * request_data.quantity)}</p>
                            </div>
                        </div>

                        {/* Kolom Kanan: ACTION CENTER */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6 "> Langkah Selanjutnya</h4>
                            
                            {/* INFO SLA 3 HARI KERJA (REVISI BARU) */}
                            {['on_process', 'verifikasi_payment'].includes(request_data.status) && (
                                <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <p className="text-[11px] leading-relaxed text-slate-300 italic">
                                        Data diproses <strong>paling lambat 3 Hari Kerja</strong> (Sabtu, Minggu, & libur nasional tidak dihitung dalam masa proses).
                                    </p>
                                </div>
                            )}

                            {/* ALERT REVISI ADMIN (PINTAR: Hanya muncul jika ada catatan real dari admin) */}
                            {request_data.admin_note && 
                            request_data.status !== 'rejected' && // FIX: Tambahkan ini agar tidak dobel saat ditolak
                            request_data.admin_note !== 'User meminta ulang kode billing karena expired.' && (
                                <div className="bg-amber-500/10 border-2 border-amber-500/50 p-6 rounded-[2rem] mb-8 flex gap-5 items-start">
                                    <div className="p-3 bg-amber-500 rounded-2xl text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">Catatan Admin</h5>
                                        <p className="text-sm font-bold text-amber-100 italic leading-relaxed">"{request_data.admin_note}"</p>
                                    </div>
                                </div>
                            )}

                            {/* CASE: DITOLAK */}
                            {request_data.status === 'rejected' && (
                                <div className="space-y-6">
                                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                                        <p className="text-[10px] font-black uppercase text-red-400 mb-2">Alasan Penolakan:</p>
                                        <p className="text-sm font-medium italic text-red-50 leading-relaxed">"{request_data.admin_note || 'Berkas tidak sesuai ketentuan.'}"</p>
                                    </div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-loose">Silakan hubungi Admin untuk informasi lebih lanjut.</p>
                                </div>
                            )}

                            {/* CASE: INVALID (BILLING HABIS 7 HARI) */}
                            {request_data.status === 'invalid' && (
                                <div className="space-y-6">
                                    <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl text-amber-200">
                                        <p className="text-xs font-medium leading-relaxed italic">Masa berlaku kode billing (7 hari) telah habis. Silakan minta kode baru.</p>
                                    </div>
                                    <Link 
                                        href={route('status.re_request', request_data.ticket_code)} 
                                        method="post" as="button"
                                        className="w-full bg-blue-600 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition shadow-lg"
                                    >
                                        Minta Billing Baru
                                    </Link>
                                </div>
                            )}

                            {/* CASE: MENUNGGU PEMBAYARAN */}
                            {request_data.status === 'waiting_payment' && (
                                <div className="space-y-6">
                                    <p className="text-sm font-medium opacity-80 leading-relaxed italic">Segera selesaikan pembayaran dalam 7 hari menggunakan Kode Billing di bawah ini:</p>
                                    <FilePreview label="File Billing (VA)" id={request_data.id} type="billing" password={data.password} />

                                    <form onSubmit={handleUploadProof} className="pt-6 border-t border-white/10 space-y-4">
                                        <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">Upload Bukti Bayar (PDF/JPG)</label>
                                        <input type="file" onChange={e => uploadForm.setData('payment_proof', e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white cursor-pointer" required />
                                        <button disabled={uploadForm.processing} className="w-full bg-emerald-500 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition shadow-lg">Kirim Bukti Pembayaran</button>
                                    </form>
                                </div>
                            )}

                            {/* CASE: PAID / DONE (DOWNLOAD HASIL - 14 HARI) */}
                            {(request_data.status === 'paid' || request_data.status === 'done') && (
                                <div className="space-y-6 text-center">
                                    <p className="text-sm font-medium text-emerald-400 italic">Pembayaran Berhasil Diverifikasi!</p>
                                    <a 
                                        href={route('status.download', { id: request_data.id, password: data.password })}
                                        className="flex items-center justify-center gap-3 w-full bg-white text-slate-900 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition shadow-xl"
                                    >
                                        <IconDownload />
                                        Unduh Hasil Data
                                    </a>
                                    <p className="text-[9px] text-slate-500 italic px-4 leading-relaxed">Link aktif selama 14 hari kalender. Segera simpan dokumen Anda.</p>
                                    {request_data.downloaded_at && (
                                        <p className="text-[9px] text-slate-500 uppercase tracking-widest">Terakhir diunduh: {new Date(request_data.downloaded_at).toLocaleString('id-ID')}</p>
                                    )}
                                </div>
                            )}

                            {/* CASE: EXPIRED (TELAT DOWNLOAD - 14 HARI) */}
                            {request_data.status === 'expired' && (
                                <div className="py-10 text-center">
                                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                                    </div>
                                    <p className="text-sm font-black text-red-400 uppercase tracking-tighter">Masa Unduh Habis</p>
                                    <p className="text-[10px] text-slate-400 mt-2 italic leading-relaxed px-4">Batas waktu unduh 14 hari telah berakhir. Data telah dikunci secara otomatis.</p>
                                </div>
                            )}

                            {/* LOADING STATES */}
                            {request_data.status === 'on_process' && (
                                <p className="text-sm opacity-60 italic text-center py-10">
                                    {request_data.admin_note === 'User meminta ulang kode billing karena expired.' 
                                        ? 'Menunggu admin menerbitkan billing baru...' 
                                        : 'Dalam proses pengerjaan oleh admin...'}
                                </p>
                            )}

                            {request_data.status === 'verifikasi_payment' && (
                                <p className="text-sm opacity-60 italic text-center py-10">
                                    Bukti pembayaran sedang dicek oleh admin...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Komponen Pendukung
function FilePreview({ label, id, type, password }) {
    const streamUrl = route('permohonan.file.stream', { id, type, password });
    return (
        <div className="group">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">{label}</p>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-inner h-32">
                <iframe src={streamUrl} className="w-full h-full opacity-30 pointer-events-none" title={label}></iframe>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <a href={streamUrl} target="_blank" className="bg-white text-slate-900 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-xl">Buka Full ↗</a>
                </div>
            </div>
        </div>
    );
}

// Icons
const IconPermohonan = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
const IconPembayaran = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.051-.659-1.172-.879-1.172-2.303 0-3.182 1.172-.879 3.07-.879 4.242 0L15 8.818M3.75 21.75h16.5a2.25 2.25 0 0 0 2.25-2.25V4.5a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v15a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>;
const IconSelesai = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>;
const IconDownload = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;