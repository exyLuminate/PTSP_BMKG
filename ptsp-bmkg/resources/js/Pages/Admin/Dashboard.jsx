import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function Dashboard({ auth, monthlyStats, paymentStats, summary }) {
    
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Analitik PTSP BMKG</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-6 sm:py-12 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/** * STAT CARD GRID
                     * Mobile: 1 Kolom (grid-cols-1)
                     * Tablet: 2 Kolom (sm:grid-cols-2)
                     * Desktop: 4 Kolom (lg:grid-cols-4)
                     */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <StatCard title="Total Permintaan" value={summary.total_requests} color="text-blue-600" desc="Keseluruhan tiket masuk" />
                        <StatCard title="Butuh Verifikasi" value={summary.pending_verification} color="text-purple-600" desc="Berkas & bukti bayar baru" />
                        <StatCard title="Layanan Sukses" value={paymentStats.paid + paymentStats.done} color="text-green-600" desc="Data berhasil dikirim" />
                        <StatCard title="Gagal / Expired" value={paymentStats.expired + (paymentStats.rejected || 0)} color="text-red-600" desc="Tiket tidak terselesaikan" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Bar Chart Bulanan */}
                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Tren Permintaan Data</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Volume Per-Bulan Tahun {new Date().getFullYear()}</p>
                            </div>
                            {/* Tinggi grafik disesuaikan: h-64 di mobile, h-80 di layar besar */}
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

                        {/* Pie Chart Status */}
                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Distribusi Status</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Lifecycle Permohonan Saat Ini</p>
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
                                        <Legend 
                                            verticalAlign="bottom" 
                                            height={36} 
                                            iconType="circle" 
                                            wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} 
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
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
                <p className={`text-3xl sm:text-4xl font-black ${color}`}>{value}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase">Tiket</p>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-4 border-t pt-3 border-slate-50 font-medium">
                {desc}
            </p>
        </div>
    );
}