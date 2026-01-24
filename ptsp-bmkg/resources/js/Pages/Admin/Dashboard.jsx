import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function Dashboard({ auth, monthlyStats, paymentStats, summary, recentRequests }) {
    
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    const chartData = monthlyStats.map(item => ({
        name: monthNames[item.month],
        jumlah: item.total
    }));

    const pieData = [
        { name: 'Selesai', value: paymentStats.done, color: '#059669' },
        { name: 'Lunas', value: paymentStats.paid, color: '#10B981' },
        { name: 'Verif Bayar', value: paymentStats.verifikasi_payment, color: '#8B5CF6' },
        { name: 'Tunggu Bayar', value: paymentStats.waiting_payment, color: '#F59E0B' },
        { name: 'Proses', value: paymentStats.on_process, color: '#3B82F6' },
        { name: 'Kedaluwarsa', value: paymentStats.expired, color: '#EF4444' },
    ].filter(item => item.value > 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-slate-800 uppercase tracking-tight">Dashboard Analitik PTSP BMKG</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-6 sm:py-12 bg-slate-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* STAT CARD GRID - Formasi 3 Kolom (Desktop) untuk 6 Kartu */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                        
                        {/* Baris 1: Statistik Tiket */}
                        <StatCard title="Total Tiket" value={summary.total_requests} color="text-slate-900" desc="Keseluruhan tiket masuk" />
                        
                        <div className={summary.pending_verification > 0 ? "animate-pulse" : ""}>
                            <StatCard title="Perlu Verifikasi" value={summary.pending_verification} color="text-blue-600" desc="Berkas & Bukti bayar baru" />
                        </div>

                        <StatCard title="Layanan Sukses" value={paymentStats.paid + paymentStats.done} color="text-emerald-600" desc="Data berhasil terkirim" />
                        <StatCard title="Gagal / Expired" value={paymentStats.expired + (paymentStats.rejected || 0)} color="text-red-500" desc="Tiket hangus/ditolak" />

                        {/* Baris 2: Statistik Keuangan (PNBP) */}
                        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border-l-4 border-l-blue-500 border-slate-200">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PNBP Bulan Ini</p>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-xs font-bold text-slate-400">Rp</span>
                                <p className="text-2xl sm:text-3xl font-black text-slate-900 italic">
                                    {new Intl.NumberFormat('id-ID').format(summary.monthly_pnbp || 0)}
                                </p>
                            </div>
                            <p className="text-[10px] mt-4 text-blue-600 font-bold uppercase border-t pt-3 border-slate-50 italic">
                                Periode {monthNames[new Date().getMonth() + 1]} {new Date().getFullYear()}
                            </p>
                        </div>

                        <div className="bg-emerald-600 p-5 sm:p-6 rounded-2xl shadow-lg shadow-emerald-100 border border-emerald-500 text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">PNBP Tahun Ini</p>
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-xs font-bold opacity-70">Rp</span>
                            <p className="text-xl sm:text-2xl font-black italic">
                                {new Intl.NumberFormat('id-ID').format(summary.yearly_pnbp || 0)}
                            </p>
                        </div>
                        <p className="text-[10px] mt-4 opacity-70 font-bold uppercase border-t border-emerald-400 pt-3 italic">
                            Januari - Desember {new Date().getFullYear()}
                        </p>
                    </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
                        <div className="bg-white p-4 sm:p-6 rounded-[2rem] shadow-sm border border-slate-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Tren Permintaan Data</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1 italic">Volume Per-Bulan Tahun {new Date().getFullYear()}</p>
                            </div>
                            <div className="h-64 sm:h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            cursor={{fill: '#f1f5f9'}}
                                        />
                                        <Bar dataKey="jumlah" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={window.innerWidth < 640 ? 20 : 40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-[2rem] shadow-sm border border-slate-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Distribusi Status</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1 italic">Lifecycle Permohonan Saat Ini</p>
                            </div>
                            <div className="h-64 sm:h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={pieData} 
                                            innerRadius={window.innerWidth < 640 ? 50 : 70} 
                                            outerRadius={window.innerWidth < 640 ? 80 : 100} 
                                            paddingAngle={5} 
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Aktivitas Terkini Table */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Aktivitas Terkini</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">5 Permintaan Terbaru Masuk</p>
                            </div>
                            <Link href={route('admin.requests.index')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                                Lihat Semua ↗
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiket</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Pemohon</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Layanan</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentRequests?.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-bold text-blue-600 text-xs tracking-tighter">{req.ticket_code}</td>
                                            <td className="px-6 py-4 font-bold text-slate-700 text-xs uppercase">{req.name}</td>
                                            <td className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">{req.catalog?.info_type}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={route('admin.requests.show', req.id)} className="bg-slate-900 text-white text-[9px] font-black px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-blue-600 transition">Detail</Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentRequests?.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-slate-400 text-xs italic">Belum ada aktivitas terbaru.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, color, desc }) {
    return (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-200 transition-all duration-300">
            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
                <p className={`text-3xl sm:text-4xl font-black italic ${color}`}>{value}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-tighter">Tiket</p>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-4 border-t pt-3 border-slate-50 font-medium italic leading-tight">
                {desc}
            </p>
        </div>
    );
}