import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function RequestList({ auth, requests, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ 
                preserveScroll: true, 
                only: ['requests', 'notifications'] 
            });
        }, 30000); // Refresh setiap 30 detik

        return () => clearInterval(interval); // Matikan interval jika pindah halaman
    }, []);
    // 1. Config Status (Gak Hardcode, Gampang Diubah)
    const statusConfigs = [
        { id: '', label: 'SEMUA', color: 'bg-slate-200 text-slate-700', border: 'border-slate-300' },
        { id: 'on_process', label: 'PROSES', color: 'bg-blue-600 text-white', border: 'border-blue-700' },
        { id: 'waiting_payment', label: 'BAYAR', color: 'bg-amber-500 text-white', border: 'border-amber-600' },
        { id: 'verifikasi_payment', label: 'VERIF', color: 'bg-purple-600 text-white', border: 'border-purple-700' },
        { id: 'paid', label: 'LUNAS', color: 'bg-emerald-600 text-white', border: 'border-emerald-700' },
        { id: 'done', label: 'DONE', color: 'bg-indigo-600 text-white', border: 'border-indigo-700' },
        { id: 'rejected', label: 'DITOLAK', color: 'bg-red-600 text-white', border: 'border-red-700' },
    ];

    const handleFilter = (newStatus = status) => {
        router.get(route('admin.requests.index'), 
            { search, status: newStatus }, 
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilter();
    };

    // Helper Warna untuk Badge di dalam Tabel/Card
    const getStatusStyle = (status) => {
        const styles = {
            on_process: 'bg-blue-50 text-blue-700 border-blue-200',
            waiting_payment: 'bg-amber-50 text-amber-700 border-amber-200',
            verifikasi_payment: 'bg-purple-50 text-purple-700 border-purple-200',
            paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            done: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            rejected: 'bg-red-50 text-red-700 border-red-200',
            expired: 'bg-slate-50 text-slate-500 border-slate-200',
        };
        return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-slate-800 tracking-tight uppercase">Database Permohonan</h2>}
        >
            <Head title="Manajemen Permintaan" />

            <div className="py-6 sm:py-12 bg-slate-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* TOOLBAR SEARCH */}
                    <div className="mb-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
                        <form onSubmit={handleSearchSubmit} className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Cari Kode atau Nama..." 
                                className="border-slate-200 rounded-2xl shadow-sm w-full focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-2xl hover:bg-blue-600 font-black text-xs uppercase transition-all active:scale-95">
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* DYNAMIC FILTER CHIPS (Scrollable on Mobile) */}
                    <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 sticky left-0 bg-slate-50 pr-2">Filter:</span>
                        {statusConfigs.map((cfg) => (
                            <button
                                key={cfg.id}
                                onClick={() => { setStatus(cfg.id); handleFilter(cfg.id); }}
                                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black transition-all border uppercase tracking-wider ${
                                    status === cfg.id 
                                    ? `${cfg.color} border-transparent shadow-md scale-105` 
                                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                                }`}
                            >
                                {cfg.label}
                            </button>
                        ))}
                    </div>

                    {/* --- VIEW MOBILE: CARD SYSTEM --- */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {requests?.data?.length > 0 ? requests.data.map((req) => (
                            <div key={req.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 relative overflow-hidden group">
                                {/* Garis Status di Samping */}
                                <div className={`absolute left-0 top-0 bottom-0 w-2 ${getStatusStyle(req.status).split(' ')[0]}`}></div>
                                
                                <div className="flex justify-between items-start mb-3 pl-2">
                                    <span className="font-black text-blue-600 tracking-tighter text-sm uppercase">{req.ticket_code}</span>
                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${getStatusStyle(req.status)}`}>
                                        {req.status.replace('_', ' ')}
                                    </span>
                                </div>
                                
                                <div className="pl-2 mb-4">
                                    <h4 className="text-sm font-black text-slate-800 uppercase leading-tight">{req.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-mono mt-1 italic">{req.catalog?.info_type || 'Custom Request'}</p>
                                </div>

                                <Link 
                                    href={route('admin.requests.show', req.id)} 
                                    className="block w-full text-center bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                                >
                                    Kelola Permohonan
                                </Link>
                            </div>
                        )) : (
                            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-300 text-slate-400 text-xs font-bold uppercase tracking-widest">Data Kosong</div>
                        )}
                    </div>

                    {/* --- VIEW DESKTOP: TABLE SYSTEM --- */}
                    <div className="hidden md:block bg-white overflow-hidden shadow-sm rounded-[2rem] border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Pemohon</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {requests?.data?.map((req) => (
                                    <tr key={req.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 font-black text-blue-600 tracking-tighter text-sm">{req.ticket_code}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-black text-slate-800 uppercase leading-none">{req.name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono mt-1 italic">{req.catalog?.info_type}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${getStatusStyle(req.status)}`}>
                                                {req.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={route('admin.requests.show', req.id)} className="inline-flex text-[10px] font-black text-slate-900 uppercase tracking-widest border-2 border-slate-900 px-4 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {requests?.links && (
                        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                Result: Terdapat {requests.total} Tiket
                            </div>
                            <nav className="flex flex-wrap justify-center gap-1.5">
                                {requests.links.map((link, index) => {
                                    const cleanLabel = link.label.replace('&laquo; Previous', '←').replace('Next &raquo;', '→');
                                    if (!link.url) return <span key={index} dangerouslySetInnerHTML={{ __html: cleanLabel }} className="min-w-[38px] h-[38px] flex items-center justify-center rounded-xl text-[10px] font-black border border-slate-100 text-slate-200 opacity-50" />;
                                    return (
                                        <Link key={index} href={link.url} dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                            className={`min-w-[38px] h-[38px] flex items-center justify-center rounded-xl text-[10px] font-black border transition-all ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-200 hover:text-blue-600'}`}
                                        />
                                    );
                                })}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}