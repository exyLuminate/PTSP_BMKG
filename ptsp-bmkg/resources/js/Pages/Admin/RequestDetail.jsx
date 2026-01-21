import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function RequestDetail({ auth, requestData }) {
    // Inisialisasi Form Inertia
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        status: requestData.status,
        admin_note: requestData.admin_note || '',
        va_file: null,      // Untuk unggah PDF Billing
        result_file: null,  // Untuk unggah Hasil Data
    });

    // Menghitung Total PNBP: Harga x Kuantitas
    const totalPnbp = requestData.catalog.price * requestData.quantity;

    // Fungsi Aksi Utama (Update Status & Upload File)
    const handleAction = (newStatus) => {
        // Langsung timpa status di objek data untuk menghindari async lag dari setData
        data.status = newStatus;

        post(route('admin.requests.update', requestData.id), {
            forceFormData: true, // Wajib true karena ada upload file
            preserveScroll: true,
            onSuccess: () => {
                // Reset input file setelah sukses agar tidak terkirim dua kali
                setData('va_file', null);
                setData('result_file', null);
            },
        });
    };

    // Label Tombol Dinamis berdasarkan workflow
    const getNextActionLabel = () => {
        switch (requestData.status) {
            case 'on_process': return 'Setujui & Kirim Billing';
            case 'verifikasi_payment': return 'Konfirmasi Pembayaran Selesai';
            default: return null;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.requests.index')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <h2 className="font-black text-xl text-slate-800 tracking-tight uppercase">
                            Tiket <span className="text-blue-600">#{requestData.ticket_code}</span>
                        </h2>
                    </div>
                    <span className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border ${getStatusStyle(requestData.status)}`}>
                        {requestData.status.replace('_', ' ')}
                    </span>
                </div>
            }
        >
            <Head title={`Detail ${requestData.ticket_code}`} />

            <div className="py-12 bg-slate-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- KOLOM KIRI: DATA PEMOHON & BERKAS --- */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* 1. Informasi Identitas & Layanan */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Informasi Pemohon & Layanan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Nama Lengkap</p>
                                    <p className="font-bold text-slate-800 text-lg uppercase">{requestData.name}</p>
                                    <p className="text-xs text-slate-400 mt-1">{requestData.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">NIK (Terenkripsi)</p>
                                    <p className="font-mono font-bold text-slate-800 tracking-wider bg-slate-50 px-3 py-1 rounded-lg inline-block border border-slate-100">
                                        {requestData.nik}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Layanan Data</p>
                                    <p className="font-bold text-blue-700">{requestData.catalog.info_type}</p>
                                    <p className="text-[9px] text-slate-400 mt-1 uppercase font-black tracking-widest">{requestData.catalog.category}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Tagihan PNBP</p>
                                    <p className="font-black text-2xl text-emerald-600">
                                        Rp {new Intl.NumberFormat('id-ID').format(totalPnbp)}
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase italic mt-1">
                                        Perhitungan: {requestData.quantity} {requestData.catalog.unit}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Deskripsi Permintaan */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Rincian Deskripsi</h3>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 leading-relaxed font-medium">
                                "{requestData.description || 'Tidak ada deskripsi tambahan.'}"
                            </div>
                        </div>

                        {/* 3. Berkas Persyaratan (KTP & Surat) */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Dokumen Persyaratan User</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FilePreview label="Kartu Tanda Penduduk" id={requestData.id} type="ktp" />
                                <FilePreview label="Surat Permohonan Resmi" id={requestData.id} type="letter" />
                            </div>
                        </div>

                        {/* 4. Bukti Bayar & File Admin (Jika Ada) */}
                        {(requestData.payment_proof_path || requestData.va_file_path || requestData.result_file_path) && (
                            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 text-center border-b border-white/10 pb-4">Arsip Dokumen Transaksi</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {requestData.payment_proof_path && (
                                        <FilePreview label="Bukti Bayar User" id={requestData.id} type="proof" dark />
                                    )}
                                    {requestData.va_file_path && (
                                        <FilePreview label="Billing (Admin)" id={requestData.id} type="billing" dark />
                                    )}
                                    {requestData.result_file_path && (
                                        <FilePreview label="Hasil Data (Admin)" id={requestData.id} type="result" dark />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- KOLOM KANAN: ACTION CENTER --- */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-200 sticky top-24">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 border-b pb-4">Panel Kendali Admin</h3>
                            
                            <form className="space-y-8">
                                {/* INPUT FILE UNTUK STATUS PROSES */}
                                {requestData.status === 'on_process' && (
                                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                                        <div className="p-4 bg-blue-50 text-blue-700 text-[11px] rounded-xl border border-blue-100 font-bold leading-relaxed">
                                            Lengkapi file Billing (PDF) sebelum mengubah status menjadi "Waiting Payment".
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">PDF Kode Billing (VA)</label>
                                            <input type="file" onChange={e => setData('va_file', e.target.files[0])} className="w-full text-[10px] font-black text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white file:uppercase file:tracking-widest" />
                                            {errors.va_file && <p className="text-red-500 text-[9px] mt-2 font-bold uppercase">{errors.va_file}</p>}
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">File Hasil Data (Final)</label>
                                            <input type="file" onChange={e => setData('result_file', e.target.files[0])} className="w-full text-[10px] font-black text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-900 file:text-white file:uppercase file:tracking-widest" />
                                            {errors.result_file && <p className="text-red-500 text-[9px] mt-2 font-bold uppercase">{errors.result_file}</p>}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan / Alasan</label>
                                    <textarea 
                                        className="w-full text-sm border-slate-200 rounded-2xl focus:ring-blue-500 h-24 font-medium bg-slate-50"
                                        value={data.admin_note}
                                        onChange={e => setData('admin_note', e.target.value)}
                                        placeholder="Tulis alasan jika menolak atau instruksi tambahan..."
                                    />
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    {getNextActionLabel() && (
                                        <button 
                                            type="button"
                                            onClick={() => handleAction(requestData.status === 'on_process' ? 'waiting_payment' : 'paid')}
                                            disabled={processing}
                                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50"
                                        >
                                            {processing ? 'Memproses...' : getNextActionLabel()}
                                        </button>
                                    )}

                                    {['on_process', 'verifikasi_payment'].includes(requestData.status) && (
                                        <button 
                                            type="button"
                                            onClick={() => handleAction('rejected')}
                                            disabled={processing}
                                            className="w-full bg-white text-red-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-red-200 hover:bg-red-50 transition"
                                        >
                                            Tolak / Batalkan
                                        </button>
                                    )}

                                    {['paid', 'done', 'rejected'].includes(requestData.status) && (
                                        <button 
                                            type="button"
                                            onClick={() => handleAction('on_process')}
                                            className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition"
                                        >
                                            🔄 Reset Ke Proses Verifikasi
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

// Komponen Preview PDF dengan rute streaming privat
function FilePreview({ label, id, type, dark = false }) {
    const streamUrl = route('admin.file.stream', { id, type });
    
    return (
        <div className="group">
            <p className={`text-[10px] font-black uppercase mb-3 tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
            <div className={`relative rounded-[2rem] overflow-hidden border ${dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'} shadow-inner group-hover:border-blue-500 transition-all`}>
                <iframe src={streamUrl} className="w-full h-80" title={label}></iframe>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <a href={streamUrl} target="_blank" className="bg-white text-slate-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform flex items-center gap-2">
                        Buka Dokumen ↗
                    </a>
                </div>
            </div>
        </div>
    );
}

// Style Badge Status
function getStatusStyle(status) {
    switch (status) {
        case 'on_process': return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'waiting_payment': return 'bg-amber-50 text-amber-600 border-amber-100';
        case 'verifikasi_payment': return 'bg-purple-50 text-purple-600 border-purple-100';
        case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
        default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
}