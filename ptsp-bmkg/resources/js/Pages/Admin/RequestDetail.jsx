import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function RequestDetail({ auth, requestData }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH', // Menggunakan _method karena upload file lewat PATCH/PUT di Laravel butuh ini
        status: requestData.status,
        va_number: requestData.va_number || '',
        admin_note: requestData.admin_note || '',
        result_file: null,
    });

    const updateStatus = (newStatus) => {
        data.status = newStatus;
        post(route('admin.requests.update', requestData.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800">Detail Permohonan: {requestData.ticket_code}</h2>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${getStatusColor(requestData.status)}`}>
                        {requestData.status.replace('_', ' ')}
                    </span>
                </div>
            }
        >
            <Head title="Detail Permintaan" />

            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Kolom Kiri: Informasi Pemohon & Dokumen (Tetap sama) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold mb-4 border-b pb-2 text-blue-600">Data Pemohon</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="text-gray-500">Nama Lengkap</p><p className="font-semibold">{requestData.name}</p></div>
                                <div><p className="text-gray-500">NIK</p><p className="font-semibold">{requestData.nik}</p></div>
                                <div><p className="text-gray-500">Jenis Layanan</p><p className="font-semibold text-blue-700">{requestData.catalog.info_type}</p></div>
                                <div><p className="text-gray-500">Total PNBP</p><p className="font-bold text-green-600">Rp {(requestData.catalog.price * requestData.quantity).toLocaleString()}</p></div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold mb-4 text-blue-600">Verifikasi Dokumen</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FilePreview label="Scan KTP" path={requestData.ktp_path} />
                                <FilePreview label="Surat Permohonan" path={requestData.letter_path} />
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: ACTION CENTER (Sistem Berbasis Tombol) */}
                    <div className="space-y-6 h-fit sticky top-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500">
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Aksi Admin</h3>
                            
                            {/* Alur 1: PROSES VERIFIKASI (Jika status on_process) */}
                            {requestData.status === 'on_process' && (
                                <div className="space-y-4">
                                    <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded border border-blue-100">
                                        Periksa berkas di sebelah kiri. Jika valid, masukkan nomor VA untuk pembayaran.
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nomor Virtual Account (VA)</label>
                                        <input 
                                            type="text" 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500"
                                            placeholder="Contoh: 82770001234..."
                                            value={data.va_number}
                                            onChange={e => setData('va_number', e.target.value)}
                                        />
                                        {errors.va_number && <p className="text-red-500 text-xs mt-1">{errors.va_number}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => updateStatus('ready')}
                                            disabled={!data.va_number || processing}
                                            className="flex-1 bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 disabled:bg-gray-300"
                                        >
                                            Setujui & Kirim VA
                                        </button>
                                        <button 
                                            onClick={() => updateStatus('rejected')}
                                            className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                                        >
                                            Tolak
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Alur 2: MENUNGGU PEMBAYARAN (Jika status ready) */}
                            {requestData.status === 'ready' && (
                                <div className="space-y-4 text-center">
                                    <div className="p-4 bg-orange-50 border border-orange-200 rounded text-orange-800">
                                        <p className="text-xs uppercase font-bold">Menunggu Pembayaran</p>
                                        <p className="text-lg font-mono font-bold mt-1">{requestData.va_number}</p>
                                        <p className="text-[10px] mt-1 text-orange-600">VA Hangus dalam 1x24 jam</p>
                                    </div>
                                    <button 
                                        onClick={() => updateStatus('paid')}
                                        className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700"
                                    >
                                        Konfirmasi Sudah Bayar
                                    </button>
                                    <button 
                                        onClick={() => updateStatus('on_process')}
                                        className="text-xs text-gray-400 hover:underline"
                                    >
                                        Batalkan VA & Kembali ke Proses Verifikasi
                                    </button>
                                </div>
                            )}

                            {/* Alur 3: UPLOAD DATA (Jika status paid) */}
                            {requestData.status === 'paid' && (
                                <div className="space-y-4">
                                    <div className="p-3 bg-green-50 text-green-700 text-sm rounded border border-green-100 flex items-center gap-2">
                                        <span className="text-xl">💰</span> Pembayaran Terkonfirmasi. Silakan upload hasil data.
                                    </div>
                                    <div>
                                        <input 
                                            type="file" 
                                            className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white"
                                            onChange={e => setData('result_file', e.target.files[0])}
                                        />
                                        {errors.result_file && <p className="text-red-500 text-xs mt-1">{errors.result_file}</p>}
                                    </div>
                                    <button 
                                        onClick={() => updateStatus('paid')}
                                        disabled={!data.result_file || processing}
                                        className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 disabled:bg-gray-300"
                                    >
                                        {requestData.result_file_path ? 'Update File Data' : 'Kirim File Data ke User'}
                                    </button>
                                </div>
                            )}

                            {/* Status Terminal: Rejected / Expired */}
                            {(requestData.status === 'rejected' || requestData.status === 'expired') && (
                                <button 
                                    onClick={() => updateStatus('on_process')}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-md hover:bg-gray-50"
                                >
                                    Buka Kembali Permohonan (Reset)
                                </button>
                            )}

                            <div className="mt-6 pt-4 border-t">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Catatan Admin</label>
                                <textarea 
                                    className="w-full text-sm border-gray-200 rounded focus:ring-orange-500"
                                    rows="2"
                                    value={data.admin_note}
                                    onChange={e => setData('admin_note', e.target.value)}
                                    placeholder="Alasan tolak atau catatan tambahan..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Helper Components & Functions
function FilePreview({ label, path }) {
    return (
        <div>
            <p className="text-sm font-medium mb-2 text-gray-700">{label}</p>
            <iframe src={`/storage/${path}`} className="w-full h-64 border rounded bg-gray-200" title={label}></iframe>
            <a href={`/storage/${path}`} target="_blank" className="text-xs text-blue-600 hover:underline mt-1 block text-right">Buka di Tab Baru ↗</a>
        </div>
    );
}

function getStatusColor(status) {
    switch (status) {
        case 'on_process': return 'bg-blue-100 text-blue-800';
        case 'ready': return 'bg-orange-100 text-orange-800';
        case 'paid': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}