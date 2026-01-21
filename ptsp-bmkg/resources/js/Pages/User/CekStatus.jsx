import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function CekStatus({ results, search_nik }) {
    const { data, setData, post, processing } = useForm({
        nik: search_nik || '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        post(route('status.search'));
    };

    // Fungsi khusus untuk menangani klik tombol Detail
    const handleViewDetail = (ticketCode) => {
        // Mengirimkan kode tiket melalui body POST agar tidak error Method Not Allowed
        post(route('status.show'), {
            data: { ticket: ticketCode }
        });
    };

    // Mapping 7 Status Resmi sesuai Database
    const getStatusLabel = (status) => {
        const labels = {
            on_process: { text: 'ON PROCESS', color: 'bg-blue-100 text-blue-700' },
            waiting_payment: { text: 'MENUNGGU PEMBAYARAN', color: 'bg-amber-100 text-amber-700' },
            verifikasi_payment: { text: 'VERIFIKASI BAYAR', color: 'bg-purple-100 text-purple-700' },
            paid: { text: 'LUNAS', color: 'bg-emerald-100 text-emerald-700' },
            rejected: { text: 'DITOLAK', color: 'bg-red-100 text-red-700' },
            expired: { text: 'KADALUWARSA', color: 'bg-slate-200 text-slate-500' },
            completed: { text: 'SELESAI', color: 'bg-indigo-100 text-indigo-700' },
        };
        return labels[status] || { text: status.toUpperCase(), color: 'bg-slate-100 text-slate-700' };
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 text-slate-900">
            <Head title="Cek Status Tiket" />
            
            <div className="max-w-4xl mx-auto mb-6">
                <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Kembali ke Beranda
                </Link>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 mb-10 text-center">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2 leading-none">Lacak Tiket Anda</h2>
                    <p className="text-slate-500 font-medium mb-8 text-sm uppercase tracking-widest mt-3">Masukkan NIK untuk melihat daftar riwayat permohonan</p>
                    
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                        <input type="text" maxLength="16" value={data.nik} onChange={e => setData('nik', e.target.value)} placeholder="16 DIGIT NIK" className="flex-1 bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-600 font-black text-sm text-slate-900 shadow-inner" required />
                        <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-2xl shadow-lg transition-all uppercase text-[10px] tracking-widest">
                            {processing ? 'MENCARI...' : 'CARI TIKET'}
                        </button>
                    </form>
                </div>

                {results && results.length > 0 ? (
                    <div className="space-y-4">
                        {results.map((ticket, index) => (
                            <div key={index} className="bg-white p-8 rounded-[2rem] shadow-md border border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-blue-200 transition-all">
                                <div className="text-left">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-lg font-black text-blue-600 tracking-tighter">{ticket.ticket_code}</span>
                                        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusLabel(ticket.status).color}`}>
                                            {getStatusLabel(ticket.status).text}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">{ticket.catalog?.info_type}</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-widest italic">Diajukan: {new Date(ticket.created_at).toLocaleDateString('id-ID')}</p>
                                </div>
                                
                                {/* Gunakan Button dengan handleViewDetail, bukan <Link> */}
                                <button 
                                    onClick={() => handleViewDetail(ticket.ticket_code)}
                                    className="w-full md:w-auto bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-black px-8 py-3 rounded-xl uppercase tracking-widest transition-all text-center shadow-lg active:scale-95"
                                >
                                    Detail
                                </button>
                            </div>
                        ))}
                    </div>
                ) : results && (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Data tidak ditemukan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}