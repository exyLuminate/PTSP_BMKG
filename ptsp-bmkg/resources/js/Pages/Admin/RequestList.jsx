import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function RequestList({ auth, requests, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.requests.index'), { search }, { preserveState: true });
    };

    // Helper untuk warna status agar dinamis
    const getStatusColor = (status) => {
        const colors = {
            on_process: 'bg-blue-100 text-blue-700',
            waiting_payment: 'bg-amber-100 text-amber-700',
            verifikasi_payment: 'bg-purple-100 text-purple-700',
            paid: 'bg-emerald-100 text-emerald-700',
            completed: 'bg-indigo-100 text-indigo-700',
            rejected: 'bg-red-100 text-red-700',
            expired: 'bg-slate-100 text-slate-500',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-slate-800 tracking-tight uppercase leading-tight">Daftar Permintaan Data</h2>}
        >
            <Head title="Manajemen Permintaan" />

            <div className="py-6 sm:py-12 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Toolbar: Search (Mobile Friendly) */}
                    <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                            <input 
                                type="text" 
                                placeholder="Cari Kode Tiket / NIK..." 
                                className="border-slate-200 rounded-xl shadow-sm w-full sm:w-80 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-100">
                                Cari Data
                            </button>
                        </form>
                    </div>

                    {/* VIEW UNTUK MOBILE (Dilihat di layar < 768px) */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {requests?.data?.map((req) => (
                            <div key={req.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getStatusColor(req.status).split(' ')[0]}`}></div>
                                
                                <div className="flex justify-between items-start mb-4 pl-2">
                                    <span className="font-black text-blue-600 tracking-tighter uppercase">{req.ticket_code}</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${getStatusColor(req.status)}`}>
                                        {req.status.replace('_', ' ')}
                                    </span>
                                </div>
                                
                                <div className="space-y-1 mb-5 pl-2">
                                    <p className="text-base font-bold text-slate-800 leading-tight uppercase">{req.name}</p>
                                    <p className="text-xs text-slate-400 font-mono tracking-wider">{req.nik}</p>
                                    <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Jenis Layanan:</p>
                                        <p className="text-xs font-bold text-slate-600">{req.catalog?.info_type}</p>
                                    </div>
                                </div>

                                <Link 
                                    href={route('admin.requests.show', req.id)} 
                                    className="block w-full text-center bg-slate-900 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
                                >
                                    Buka Detail Verifikasi
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* VIEW UNTUK DESKTOP (Dilihat di layar >= 768px) */}
                    <div className="hidden md:block bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiket</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Pemohon</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Data</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {requests?.data?.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-black text-blue-600 tracking-tighter">{req.ticket_code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-800 uppercase leading-none">{req.name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono mt-1">{req.nik}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-slate-600 uppercase leading-tight max-w-[200px] truncate">
                                                {req.catalog?.info_type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${getStatusColor(req.status)}`}>
                                                {req.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link 
                                                href={route('admin.requests.show', req.id)} 
                                                className="inline-flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            >
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- KOMPONEN PAGINATION MODERN --- */}
                    {requests?.links && (
                        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
                            {/* Info Status Data */}
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Menampilkan <span className="text-slate-800">{requests.from || 0}</span> - <span className="text-slate-800">{requests.to || 0}</span> dari <span className="text-slate-800">{requests.total}</span> Tiket
                            </div>

                            {/* Navigasi Tombol */}
                            <nav className="flex flex-wrap justify-center gap-1.5">
                                {requests.links.map((link, index) => {
                                    // Bersihkan label panah standar Laravel
                                    const cleanLabel = link.label
                                        .replace('&laquo; Previous', '←')
                                        .replace('Next &raquo;', '→');

                                    // Render Link jika ada URL, render Span jika URL null
                                    return link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                            className={`
                                                min-w-[38px] h-[38px] flex items-center justify-center rounded-xl text-[10px] font-black transition-all border
                                                ${link.active 
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                                                    : 'bg-white text-slate-400 border-slate-200 hover:border-blue-400 hover:text-blue-600 active:scale-90'
                                                }
                                            `}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                            className="min-w-[38px] h-[38px] flex items-center justify-center rounded-xl text-[10px] font-black border border-slate-100 text-slate-200 cursor-not-allowed opacity-50"
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