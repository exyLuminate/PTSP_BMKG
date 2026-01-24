import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function RequestDetail({ auth, requestData }) {
    // 1. Inisialisasi Form Inertia
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        status: requestData.status,
        admin_note: requestData.admin_note || '',
        va_file: null,      // Untuk unggah PDF Billing
        result_file: null,  // Untuk unggah Hasil Data
    });

    // Menghitung Total PNBP
    const totalPnbp = requestData.catalog.price * requestData.quantity;

    const handleAction = (newStatus) => {
    // Validasi: Kalau mau mundurin status atau tolak, CATATAN WAJIB ADA
    if (['waiting_payment', 'rejected', 'on_process'].includes(newStatus) && !data.admin_note) {
        alert('Waduh! Kasih catatan dulu dong, biar User tahu apa yang harus diperbaiki.');
        return;
    }

    // Update status di data form sebelum dikirim
    data.status = newStatus;
    
    post(route('admin.requests.update', requestData.id), {
        forceFormData: true, 
        preserveScroll: true,
        onSuccess: () => {
            alert('Status berhasil diupdate!');
            setData('va_file', null);
            setData('result_file', null);
        },
    });
};

    const getNextActionLabel = () => {
        switch (requestData.status) {
            case 'on_process': return 'Setujui & Kirim Billing';
            case 'verifikasi_payment': return 'Konfirmasi Pembayaran Selesai';
            case 'waiting_payment': return 'Perbarui File Billing';
            case 'paid': return 'Perbarui File Hasil';
            default: return null;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.requests.index')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <h2 className="font-black text-lg sm:text-xl text-slate-800 tracking-tight uppercase">
                            Tiket <span className="text-blue-600">#{requestData.ticket_code}</span>
                        </h2>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${getStatusStyle(requestData.status)}`}>
                        {requestData.status.replace('_', ' ')}
                    </span>
                </div>
            }
        >
            <Head title={`Detail ${requestData.ticket_code}`} />

            <div className="py-6 sm:py-12 bg-slate-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    
                    {/* --- KOLOM KIRI: DATA & BERKAS --- */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* 1. Informasi Identitas & Layanan */}
                        <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-200">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Informasi Pemohon & Layanan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-300 uppercase">Nama Lengkap</p>
                                    <p className="font-bold text-slate-800 text-base sm:text-lg uppercase">{requestData.name}</p>
                                    <p className="text-xs text-slate-400">{requestData.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-300 uppercase">NIK (Terenkripsi)</p>
                                    <p className="font-mono font-bold text-slate-800 tracking-wider bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 inline-block text-xs sm:text-sm">
                                        {requestData.nik}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-300 uppercase">Layanan Data</p>
                                    <p className="font-bold text-blue-700">{requestData.catalog.info_type}</p>
                                    <p className="text-[9px] text-slate-400 mt-1 uppercase font-black tracking-widest">{requestData.catalog.category}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-300 uppercase">Total Tagihan PNBP</p>
                                    <p className="font-black text-xl sm:text-2xl text-emerald-600">
                                        Rp {new Intl.NumberFormat('id-ID').format(totalPnbp)}
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase italic mt-1 leading-tight">
                                        Perhitungan: {requestData.quantity} {requestData.catalog.unit}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Deskripsi Permintaan */}
                        <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-200">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Rincian Deskripsi</h3>
                            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 italic text-slate-600 leading-relaxed font-medium text-sm">
                                "{requestData.description || 'Tidak ada deskripsi tambahan.'}"
                            </div>
                        </div>

                        {/* 3. Berkas Persyaratan */}
                        <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-200">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Dokumen Persyaratan User</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <FilePreview label="KTP" id={requestData.id} type="ktp" />
                                <FilePreview label="Surat Permohonan" id={requestData.id} type="letter" />
                            </div>
                        </div>

                        {/* 4. Arsip Dokumen Transaksi */}
                        {(requestData.payment_proof_path || requestData.va_file_path || requestData.result_file_path) && (
                            <div className="bg-slate-900 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl text-white">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 text-center border-b border-white/10 pb-4">Arsip Dokumen Transaksi</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                                    {requestData.payment_proof_path && <FilePreview label="Bukti Bayar User" id={requestData.id} type="proof" dark />}
                                    {requestData.va_file_path && <FilePreview label="Billing (Admin)" id={requestData.id} type="billing" dark />}
                                    {requestData.result_file_path && <FilePreview label="Hasil Data (Admin)" id={requestData.id} type="result" dark />}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- KOLOM KANAN: PANEL KENDALI --- */}
<div className="space-y-6">
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-slate-200 lg:sticky lg:top-24">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 border-b pb-4 text-center">Panel Kendali Admin</h3>
        
        <form className="space-y-8">
            {/* Upload Zone (Kondisional) */}
            <div className="space-y-6">
                {/* Tampilkan upload Billing hanya di fase sebelum bayar */}
                {['on_process', 'waiting_payment', 'invalid'].includes(requestData.status) && (
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">PDF Kode Billing (VA)</label>
                        <input type="file" onChange={e => setData('va_file', e.target.files[0])} className="w-full text-[10px] font-black text-slate-400 file:bg-blue-600 file:text-white file:rounded-full file:px-4 file:py-1 file:border-0" />
                        {errors.va_file && <p className="text-red-500 text-[9px] mt-2 font-bold uppercase">{errors.va_file}</p>}
                    </div>
                )}
                {/* Tampilkan upload Hasil Data di fase verifikasi atau setelah bayar */}
                {['on_process', 'verifikasi_payment', 'paid'].includes(requestData.status) && (
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">File Hasil Data (Final)</label>
                        <input type="file" onChange={e => setData('result_file', e.target.files[0])} className="w-full text-[10px] font-black text-slate-400 file:bg-slate-900 file:text-white file:rounded-full file:px-4 file:py-1 file:border-0" />
                        {errors.result_file && <p className="text-red-500 text-[9px] mt-2 font-bold uppercase">{errors.result_file}</p>}
                    </div>
                )}
            </div>

            {/* Catatan Admin */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Catatan Admin</label>
                <textarea 
                    className="w-full text-sm border-slate-200 rounded-2xl h-24 font-medium bg-slate-50"
                    value={data.admin_note}
                    onChange={e => setData('admin_note', e.target.value)}
                    placeholder="Alasan revisi atau catatan..."
                />
            </div>

            {/* --- SMART BUTTONS AREA --- */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
                {/* A. TOMBOL UTAMA (PROSES MAJU) */}
                {getNextActionLabel() && (
                    <button 
                        type="button"
                        onClick={() => {
                            if(requestData.status === 'on_process') handleAction('waiting_payment');
                            else if(requestData.status === 'verifikasi_payment') handleAction('paid');
                            else handleAction(requestData.status); // Hanya update file
                        }}
                        disabled={processing}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                    >
                        {processing ? 'Memproses...' : getNextActionLabel()}
                    </button>
                )}

                {/* B. TOMBOL REVISI (Jika bukti bayar ngeblur) */}
                {requestData.status === 'verifikasi_payment' && (
                    <button 
                        type="button" 
                        onClick={() => handleAction('waiting_payment')}
                        disabled={processing}
                        className="w-full bg-amber-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-600 transition shadow-lg"
                    >
                        Bukti Bayar Salah / Ngeblur
                    </button>
                )}

                {/* C. TOMBOL TOLAK (Hanya untuk fase verifikasi) */}
                {['on_process', 'verifikasi_payment', 'waiting_payment'].includes(requestData.status) && (
                    <button 
                        type="button" 
                        onClick={() => handleAction('rejected')}
                        disabled={processing}
                        className="w-full bg-white text-red-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-red-200 hover:bg-red-50 transition"
                    >
                        Tolak Permohonan
                    </button>
                )}

                {/* D. TOMBOL RESET / RE-AKTIFKAN (Untuk tiket hangus atau selesai) */}
                {['paid', 'done', 'rejected', 'invalid', 'expired'].includes(requestData.status) && (
                    <button 
                        type="button" 
                        onClick={() => handleAction('on_process')} 
                        className={`w-full py-4 border-2 border-dashed rounded-2xl text-[10px] font-black uppercase tracking-widest transition
                            ${['invalid', 'expired'].includes(requestData.status) ? 'border-amber-300 text-amber-600 hover:bg-amber-50' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                    >
                        {['invalid', 'expired'].includes(requestData.status) ? '🔄 Re-aktifkan Tiket' : '🔄 Reset Ke Proses'}
                    </button>
                )}
            </div>
        </form>
    </div>
</div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function FilePreview({ label, id, type, dark = false }) {
    const streamUrl = route('admin.file.stream', { id, type });
    return (
        <div className="group">
            <p className={`text-[10px] font-black uppercase mb-3 tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
            <div className={`relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border ${dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'} shadow-inner group-hover:border-blue-500 transition-all`}>
                <iframe src={streamUrl} className="w-full h-64 sm:h-80" title={label}></iframe>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <a href={streamUrl} target="_blank" className="bg-white text-slate-900 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
                        Buka PDF ↗
                    </a>
                </div>
            </div>
        </div>
    );
}

function getStatusStyle(status) {
    switch (status) {
        case 'on_process': return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'waiting_payment': return 'bg-amber-50 text-amber-600 border-amber-100';
        case 'verifikasi_payment': return 'bg-purple-50 text-purple-600 border-purple-100';
        case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
        case 'invalid': return 'bg-slate-900 text-slate-300 border-slate-700'; 
        case 'expired': return 'bg-red-900 text-white border-red-800'; 
        case 'done': return 'bg-slate-100 text-slate-500 border-slate-200'; 
        default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
}