import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ActivityLogList({ auth, logs }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight uppercase tracking-tight">Audit Trail - Log Aktivitas Admin</h2>}
        >
            <Head title="Audit Trail" />

            <div className="py-12 bg-slate-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Tabel Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Perubahan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {logs.data.length > 0 ? (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                            {/* Kolom Waktu */}
                                            <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                                                {new Date(log.created_at).toLocaleString('id-ID')}
                                            </td>
                                            
                                            {/* Kolom Admin */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-700">{log.user.name}</span>
                                                </div>
                                            </td>

                                            {/* Kolom Aksi dengan Badge Warna */}
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getActionStyle(log.action)}`}>
                                                    {log.action.replace(/_/g, ' ')}
                                                </span>
                                            </td>

                                            {/* Kolom Detail (JSON Parsing) */}
                                            <td className="px-6 py-4">
                                                <div className="text-[11px] font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    {log.details ? Object.entries(log.details).map(([key, value]) => (
                                                        <div key={key} className="mb-1 last:mb-0">
                                                            <span className="font-black uppercase text-[8px] text-slate-400 tracking-tighter mr-1">{key.replace(/_/g, ' ')}:</span> 
                                                            <span className="text-slate-700">{String(value)}</span>
                                                        </div>
                                                    )) : <span className="italic text-slate-400">Tidak ada detail</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Belum ada riwayat aktivitas.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- Navigasi Pagination (VERSI FIX) --- */}
                    <div className="mt-6 flex justify-center gap-2">
                        {logs.links.map((link, i) => (
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        link.active 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                                            : 'bg-white text-slate-400 hover:text-blue-600 border border-slate-200'
                                    }`}
                                />
                            ) : (
                                <span
                                    key={i}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-300 border border-slate-100 cursor-not-allowed opacity-50"
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/**
 * Fungsi Helper untuk menentukan style badge berdasarkan aksi
 */
function getActionStyle(action) {
    const act = action.toLowerCase();
    
    // Emerald untuk aksi positif/penambahan
    if (act.includes('verify') || act.includes('add') || act.includes('store') || act.includes('paid')) 
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    
    // Blue untuk aksi perubahan/edit
    if (act.includes('update') || act.includes('edit') || act.includes('answer')) 
        return 'bg-blue-50 text-blue-600 border-blue-100';
    
    // Red untuk aksi penghapusan, penolakan, atau kedaluwarsa
    if (act.includes('delete') || act.includes('reject') || act.includes('destroy') || act.includes('expired')) 
        return 'bg-red-50 text-red-600 border-red-100';
    
    // Default Slate
    return 'bg-slate-50 text-slate-600 border-slate-200';
}