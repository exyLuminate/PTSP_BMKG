import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ReportPage({ auth }) {
    // 1. Mengelola input filter dengan useForm
    const { data, setData, processing, errors } = useForm({
        start_date: new Date().toISOString().split('T')[0], // Default ke hari ini
        end_date: new Date().toISOString().split('T')[0],
        status: '', 
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Membuat query string untuk download
        const queryParams = new URLSearchParams(data).toString();
        
        // Membuka route download di tab baru
        window.open(route('admin.reports.download') + '?' + queryParams, '_blank');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-slate-800 tracking-tight uppercase leading-tight">Cetak Laporan Layanan</h2>}
        >
            <Head title="Laporan" />

            <div className="py-12 bg-slate-50 min-h-screen font-sans">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-[2.5rem] border border-slate-200 p-8 md:p-12">
                        <div className="mb-8">
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Konfigurasi Laporan</h3>
                            <p className="text-sm text-slate-500 font-medium">Pilih rentang tanggal untuk mencetak laporan PNBP bulanan atau harian.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tanggal Mulai */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Tanggal Mulai</label>
                                    <input 
                                        type="date" 
                                        className="w-full rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 font-bold text-slate-700 transition-all px-4 py-3 bg-slate-50/50"
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                        required
                                    />
                                    {errors.start_date && <div className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.start_date}</div>}
                                </div>

                                {/* Tanggal Selesai */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Tanggal Selesai</label>
                                    <input 
                                        type="date" 
                                        className="w-full rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 font-bold text-slate-700 transition-all px-4 py-3 bg-slate-50/50"
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                        required
                                    />
                                    {errors.end_date && <div className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.end_date}</div>}
                                </div>
                            </div>

                            {/* Filter Status Lengkap */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Filter Status Permohonan</label>
                                <select 
                                    className="w-full rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 font-bold text-slate-700 text-sm transition-all px-4 py-3 bg-slate-50/50"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="">SEMUA STATUS</option>
                                    <option value="on_process">DALAM PROSES (ON PROCESS)</option>
                                    <option value="waiting_payment">MENUNGGU PEMBAYARAN</option>
                                    <option value="verifikasi_payment">VERIFIKASI PEMBAYARAN</option>
                                    <option value="paid">SUDAH BAYAR (PAID)</option>
                                    <option value="done">SELESAI (DONE)</option>
                                    <option value="rejected">DITOLAK (REJECTED)</option>
                                    {/* STATUS INVALID BARU */}
                                    <option value="invalid">DATA TIDAK VALID (INVALID)</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 1.223c.057.304.16.597.306.862m0 0a2.25 2.25 0 0 1-2.01 3.117H7.822a2.25 2.25 0 0 1-2.01-3.117c.146-.265.25-.558.306-.862L6.34 18M17.66 18h-11.32M9 6V3.75c0-.414.336-.75.75-.75h4.5c.414 0 .75.336.75.75V6M9 6h6M9 6H6.75A2.25 2.25 0 0 0 4.5 8.25v1.875c0 .621.504 1.125 1.125 1.125H18.375c.621 0 1.125-.504 1.125-1.125V8.25A2.25 2.25 0 0 0 15.75 6H15" />
                                    </svg>
                                    Unduh Laporan PDF
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-tighter">
                                    Laporan diproses menggunakan data real-time (Asia/Jakarta)
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}