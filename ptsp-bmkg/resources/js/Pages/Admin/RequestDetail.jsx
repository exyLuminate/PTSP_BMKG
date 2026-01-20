import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function RequestDetail({ auth, requestData }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        status: requestData.status,
        admin_note: requestData.admin_note || '',
        va_file: null,      // File PDF Billing baru
        result_file: null,  // File PDF Hasil Data baru
    });

    const handleAction = (newStatus) => {
        // Kita timpa status di data form sebelum post
        setData('status', newStatus); 
        // Menggunakan post dengan _method PATCH agar Laravel bisa membaca file upload
        post(route('admin.requests.update', requestData.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Opsional: Reset field file setelah sukses
                setData('va_file', null);
                setData('result_file', null);
            }
        });
    };

    // Helper untuk menentukan label tombol "Lanjut"
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
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Tiket: <span className="text-blue-600">#{requestData.ticket_code}</span>
                    </h2>
                    <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusStyle(requestData.status)}`}>
                        {requestData.status.replace('_', ' ')}
                    </span>
                </div>
            }
        >
            <Head title={`Detail ${requestData.ticket_code}`} />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* KOLOM KIRI: DOKUMEN & DATA PEMOHON */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Ringkasan Data */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Informasi Pemohon</h3>
                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div><p className="text-slate-400">Nama Lengkap</p><p className="font-bold text-slate-800">{requestData.name}</p></div>
                                <div><p className="text-slate-400">NIK (Terenkripsi)</p><p className="font-bold text-slate-800">{requestData.nik}</p></div>
                                <div><p className="text-slate-400">Layanan</p><p className="font-bold text-blue-700">{requestData.catalog.info_type}</p></div>
                                <div><p className="text-slate-400">Estimasi PNBP</p><p className="font-black text-green-600">Rp {(requestData.catalog.price * requestData.quantity).toLocaleString()}</p></div>
                            </div>
                        </div>

                        {/* Preview Dokumen (Menggunakan File Stream Route) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Berkas Persyaratan (PDF)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FilePreview label="Kartu Tanda Penduduk (KTP)" id={requestData.id} type="ktp" />
                                <FilePreview label="Surat Permohonan Resmi" id={requestData.id} type="letter" />
                            </div>
                        </div>

                        {/* Bukti Bayar (Hanya tampil jika user sudah upload) */}
                        {requestData.payment_proof_path && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 ring-2 ring-blue-500 ring-offset-2">
                                <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">Bukti Pembayaran User</h3>
                                <FilePreview label="Struk/Bukti Transfer PDF" id={requestData.id} type="proof" />
                            </div>
                        )}
                    </div>

                    {/* KOLOM KANAN: ACTION CENTER */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 sticky top-24">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 border-b pb-4">Aksi Strategis Admin</h3>
                            
                            <form className="space-y-6">
                                {/* INPUT TAMBAHAN BERDASARKAN STATUS */}
                                {requestData.status === 'on_process' && (
                                    <div className="space-y-4 animate-in fade-in duration-500">
                                        <div className="p-3 bg-blue-50 text-blue-700 text-[11px] rounded-lg border border-blue-100 font-medium">
                                            ⚠️ Admin wajib mengunggah <b>PDF Kode Billing</b> dan <b>File Hasil Data</b> sebelum menyetujui.
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase">Upload PDF Billing (VA)</label>
                                            <input type="file" onChange={e => setData('va_file', e.target.files[0])} className="mt-1 block w-full text-xs" />
                                            {errors.va_file && <p className="text-red-500 text-[10px] mt-1">{errors.va_file}</p>}
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase">Upload Hasil Data (PDF/ZIP)</label>
                                            <input type="file" onChange={e => setData('result_file', e.target.files[0])} className="mt-1 block w-full text-xs" />
                                            {errors.result_file && <p className="text-red-500 text-[10px] mt-1">{errors.result_file}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* CATATAN ADMIN */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Catatan / Alasan Penolakan</label>
                                    <textarea 
                                        className="mt-1 w-full text-sm border-slate-200 rounded-xl focus:ring-blue-500"
                                        rows="3"
                                        value={data.admin_note}
                                        onChange={e => setData('admin_note', e.target.value)}
                                        placeholder="Tulis alasan jika menolak berkas..."
                                    />
                                </div>

                                {/* TOMBOL AKSI DINAMIS (Hanya 2 Tombol Utama) */}
                                <div className="space-y-3">
                                    {getNextActionLabel() && (
                                        <button 
                                            type="button"
                                            onClick={() => handleAction(requestData.status === 'on_process' ? 'waiting_payment' : 'paid')}
                                            disabled={processing}
                                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:bg-slate-300"
                                        >
                                            {getNextActionLabel()}
                                        </button>
                                    )}

                                    {['on_process', 'verifikasi_payment'].includes(requestData.status) && (
                                        <button 
                                            type="button"
                                            onClick={() => handleAction('rejected')}
                                            disabled={processing}
                                            className="w-full bg-white text-red-600 py-3 rounded-xl font-bold border border-red-200 hover:bg-red-50 transition"
                                        >
                                            Tolak / Batalkan Permohonan
                                        </button>
                                    )}

                                    {/* Jika Status Terminal (Paid/Done/Expired) */}
                                    {['paid', 'done', 'expired', 'rejected'].includes(requestData.status) && (
                                        <button 
                                            type="button"
                                            onClick={() => handleAction('on_process')}
                                            className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                                        >
                                            🔄 Reset Ke Tahap Verifikasi
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

// Komponen Preview File Menggunakan Route Stream Privat
function FilePreview({ label, id, type }) {
    // Memanggil route admin.file.stream yang kita buat tadi
    const streamUrl = route('admin.file.stream', { id, type });
    
    return (
        <div className="group">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{label}</p>
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                <iframe src={streamUrl} className="w-full h-80 pointer-events-none" title={label}></iframe>
                <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={streamUrl} target="_blank" className="bg-white px-4 py-2 rounded-lg text-xs font-bold shadow-xl flex items-center gap-2">
                        Perbesar Dokumen ↗
                    </a>
                </div>
            </div>
        </div>
    );
}

function getStatusStyle(status) {
    switch (status) {
        case 'on_process': return 'bg-blue-100 text-blue-700 border border-blue-200';
        case 'waiting_payment': return 'bg-amber-100 text-amber-700 border border-amber-200';
        case 'verifikasi_payment': return 'bg-purple-100 text-purple-700 border border-purple-200';
        case 'paid': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
        case 'rejected': return 'bg-red-100 text-red-700 border border-red-200';
        default: return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
}