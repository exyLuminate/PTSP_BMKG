import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function RequestDetail({ auth, requestData }) {
    // 1. Inisialisasi Form Inertia
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        status: requestData.status,
        admin_note: requestData.admin_note || '', // Default string kosong agar tidak null
        va_file: null,      
        result_file: null,  
    });

    const totalPnbp = requestData.catalog.price * requestData.quantity;

    const handleAction = (newStatus) => {
        // --- 1. LOGIKA VALIDASI CATATAN (REVISI/TOLAK) ---
        const isNegativeFlow = ['rejected', 'invalid'].includes(newStatus);
        const isReactivating = newStatus === 'on_process' && ['expired', 'rejected', 'invalid'].includes(requestData.status);

         const isRevision = newStatus === 'waiting_payment' && requestData.status === 'verifikasi_payment';

    if ((isNegativeFlow || isReactivating || isRevision) && (!data.admin_note || data.admin_note.trim() === '')) {
        alert('Waduh! Mohon isi kolom catatan dulu agar User tahu alasan penolakan atau apa yang harus diperbaiki.');
        return;
    }

        // --- 2. LOGIKA VALIDASI FILE WAJIB (TAMBAHAN FIX) ---
        // Validasi Billing: Jika status berubah ke waiting_payment, file VA wajib ada (baru atau lama)
        if (newStatus === 'waiting_payment' && !data.va_file && !requestData.va_file_path) {
            alert('Silakan pilih file PDF Kode Billing (VA) terlebih dahulu!');
            return;
        }

        // Validasi Hasil Data: Jika status berubah ke paid, file Hasil wajib ada (baru atau lama)
        if (newStatus === 'paid' && !data.result_file && !requestData.result_file_path) {
            alert('Silakan pilih file Hasil Data terlebih dahulu!');
            return;
        }

        // Set status baru ke data form
        data.status = newStatus;
        
        // Gunakan parameter objek { id: ... } agar Ziggy tidak error toString
        post(route('admin.requests.update', { id: requestData.id }), {
            forceFormData: true, 
            preserveScroll: true,
            onSuccess: () => {
                alert('Berhasil memperbarui data!');
                // Reset file input agar tidak terkirim ulang secara tidak sengaja
                setData(prev => ({
                    ...prev,
                    va_file: null,
                    result_file: null
                }));
            },
            onError: () => {
                alert('Gagal upload! Periksa format file atau ukuran file Anda.');
            }
        });
    };

    const getNextActionLabel = () => {
        switch (requestData.status) {
            case 'on_process': return 'Setujui & Kirim Billing';
            case 'verifikasi_payment': return 'Konfirmasi Pembayaran Lunas';
            case 'waiting_payment': return 'Perbarui File Billing';
            case 'paid': return 'Perbarui File Hasil';
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

            <div className="py-6 sm:py-12 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    
                    {/* --- KOLOM KIRI --- */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informasi Pemohon */}
                        <div className="bg-white p-5 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Informasi Pemohon & Layanan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-300 uppercase">Nama Lengkap</p>
                                    <p className="font-bold text-slate-800 text-lg uppercase">{requestData.name}</p>
                                    <p className="text-xs text-slate-400">{requestData.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-300 uppercase">NIK Pemohon</p>
                                    <p className="font-mono font-bold text-slate-800 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 inline-block">
                                        {requestData.nik}
                                    </p>
                                </div>
                                 <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-300 uppercase">Layanan Data</p>
                                    <p className="font-bold text-blue-700">{requestData.catalog.info_type}</p>
                                    <p className="text-[9px] text-slate-400 mt-1 uppercase font-black tracking-widest">{requestData.catalog.category}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-300 uppercase">Total PNBP</p>
                                    <p className="font-black text-2xl text-emerald-600">
                                        Rp {new Intl.NumberFormat('id-ID').format(totalPnbp)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div className="bg-white p-5 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Rincian Deskripsi</h3>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 text-sm">
                                "{requestData.description || 'Tidak ada deskripsi tambahan.'}"
                            </div>
                        </div>

                        {/* File Preview User */}
                        <div className="bg-white p-5 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Berkas Persyaratan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FilePreview label="KTP" id={requestData.id} type="ktp" />
                                <FilePreview label="Surat Permohonan" id={requestData.id} type="letter" />
                            </div>
                        </div>

                        {/* Arsip Transaksi */}
                        {(requestData.payment_proof_path || requestData.va_file_path || requestData.result_file_path) && (
                            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 text-center border-b border-white/10 pb-4">Arsip Dokumen Transaksi</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {requestData.payment_proof_path && <FilePreview label="Bukti Bayar User" id={requestData.id} type="proof" dark />}
                                    {requestData.va_file_path && <FilePreview label="Billing (Admin)" id={requestData.id} type="billing" dark />}
                                    {requestData.result_file_path && <FilePreview label="Hasil Data (Admin)" id={requestData.id} type="result" dark />}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- PANEL KENDALI (KOLOM KANAN) --- */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-xl border border-slate-200 lg:sticky lg:top-24">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 border-b pb-4 text-center">Panel Kendali Admin</h3>
                            
                            <form className="space-y-8">
                                <div className="space-y-6">
                                    {/* Upload Billing */}
                                    {['on_process', 'waiting_payment', 'invalid'].includes(requestData.status) && (
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block italic tracking-widest">PDF Kode Billing (VA)</label>
                                            <input type="file" onChange={e => setData('va_file', e.target.files[0])} className="w-full text-[10px] file:bg-blue-600 file:text-white file:rounded-full file:px-4 file:py-1 file:border-0 cursor-pointer" />
                                            {errors.va_file && <p className="text-red-500 text-[9px] mt-2 font-bold uppercase">{errors.va_file}</p>}
                                        </div>
                                    )}
                                    {/* Upload Hasil Data */}
                                    {['on_process', 'verifikasi_payment', 'paid'].includes(requestData.status) && (
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block italic tracking-widest">File Hasil Data (Final)</label>
                                            <input type="file" onChange={e => setData('result_file', e.target.files[0])} className="w-full text-[10px] file:bg-slate-900 file:text-white file:rounded-full file:px-4 file:py-1 file:border-0 cursor-pointer" />
                                            {errors.result_file && <p className="text-red-500 text-[9px] mt-2 font-bold uppercase">{errors.result_file}</p>}
                                        </div>
                                    )}
                                </div>

                                {/* Catatan Admin */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block flex justify-between items-center">
                                        Catatan Admin
                                        {['rejected', 'invalid'].includes(data.status) ? 
                                            <span className="text-red-500 font-black animate-pulse">*Wajib</span> : 
                                            <span className="text-slate-300 font-normal italic">(Opsional)</span>}
                                    </label>
                                    <textarea 
                                        className="w-full text-sm border-slate-200 rounded-2xl h-24 font-medium bg-slate-50 focus:ring-blue-500 focus:border-blue-500"
                                        value={data.admin_note}
                                        onChange={e => setData('admin_note', e.target.value)}
                                        placeholder="Berikan alasan jika menolak/revisi..."
                                    />
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    {/* Tombol Alur Normal (Maju) */}
                                    {getNextActionLabel() && (
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                if(requestData.status === 'on_process') handleAction('waiting_payment');
                                                else if(requestData.status === 'verifikasi_payment') handleAction('paid');
                                                else handleAction(requestData.status); 
                                            }}
                                            disabled={processing}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-blue-100"
                                        >
                                            {processing ? 'Sedang Memproses...' : getNextActionLabel()}
                                        </button>
                                    )}

                                    {/* Tombol Bukti Bayar Salah */}
                                    {requestData.status === 'verifikasi_payment' && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleAction('waiting_payment')}
                                            disabled={processing}
                                            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition shadow-lg shadow-amber-100"
                                        >
                                            Bukti Bayar Salah
                                        </button>
                                    )}

                                    {/* Tombol Tolak */}
                                    {['on_process', 'verifikasi_payment', 'waiting_payment'].includes(requestData.status) && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleAction('rejected')}
                                            disabled={processing}
                                            className="w-full bg-white hover:bg-red-50 text-red-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-red-100 transition shadow-sm"
                                        >
                                            Tolak Permohonan
                                        </button>
                                    )}

                                    {/* Tombol Re-aktifkan */}
                                    {['paid', 'done', 'rejected', 'invalid', 'expired'].includes(requestData.status) && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleAction('on_process')} 
                                            className={`w-full py-4 border-2 border-dashed rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                                                ${['invalid', 'expired'].includes(requestData.status) ? 'border-amber-300 text-amber-600 hover:bg-amber-50' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                                        >
                                            {['invalid', 'expired', 'rejected'].includes(requestData.status) ? '🔄 Re-aktifkan Tiket' : '🔄 Reset Ke Proses Awal'}
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
            <div className={`relative rounded-2xl overflow-hidden border ${dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'} h-48 shadow-inner group-hover:border-blue-500 transition-all`}>
                <iframe src={streamUrl} className="w-full h-full opacity-60 pointer-events-none" title={label}></iframe>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <a href={streamUrl} target="_blank" className="bg-white text-slate-900 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
                        Buka Dokumen ↗
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