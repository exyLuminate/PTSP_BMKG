import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function Dashboard({ auth, monthlyStats, paymentStats, summary }) {
    
    // Format nama bulan untuk sumbu X grafik
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    // Pastikan data bulanan lengkap
    const chartData = monthlyStats.map(item => ({
        name: monthNames[item.month],
        jumlah: item.total
    }));

    /** * Data untuk Pie Chart
     * Menampilkan seluruh lifecycle permohonan dengan warna yang konsisten
     */
    const pieData = [
        { name: 'Selesai (Done)', value: paymentStats.done, color: '#059669' },      // Emerald-600
        { name: 'Dibayar (Paid)', value: paymentStats.paid, color: '#10B981' },      // Green-500
        { name: 'Verifikasi Bayar', value: paymentStats.verifikasi_payment, color: '#8B5CF6' }, // Purple-500
        { name: 'Menunggu Bayar', value: paymentStats.waiting_payment, color: '#F59E0B' },    // Amber-500
        { name: 'Proses (Baru)', value: paymentStats.on_process, color: '#3B82F6' }, // Blue-500
        { name: 'Kedaluwarsa', value: paymentStats.expired, color: '#EF4444' },     // Red-500
    ].filter(item => item.value > 0); // Hanya tampilkan yang ada datanya

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Analitik PTSP BMKG</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Statistik Card Utama */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Menampilkan total seluruh permohonan */}
                        <StatCard 
                            title="Total Permintaan" 
                            value={summary.total_requests} 
                            color="text-blue-600" 
                            desc="Keseluruhan tiket masuk"
                        />
                        {/* Fokus pada antrean kerja: on_process + verifikasi_payment */}
                        <StatCard 
                            title="Butuh Verifikasi" 
                            value={summary.pending_verification} 
                            color="text-purple-600" 
                            desc="Berkas & bukti bayar baru"
                        />
                        {/* Gabungan Paid & Done sebagai indikator sukses */}
                        <StatCard 
                            title="Layanan Sukses" 
                            value={paymentStats.paid + paymentStats.done} 
                            color="text-green-600" 
                            desc="Data berhasil dikirim"
                        />
                        <StatCard 
                            title="Gagal / Expired" 
                            value={paymentStats.expired + (paymentStats.rejected || 0)} 
                            color="text-red-600" 
                            desc="Tiket tidak terselesaikan"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bar Chart Bulanan */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Tren Permintaan Data</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Volume Per-Bulan Tahun {new Date().getFullYear()}</p>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            cursor={{fill: '#f1f5f9'}}
                                        />
                                        <Bar dataKey="jumlah" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart Status */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Distribusi Status</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Lifecycle Permohonan Saat Ini</p>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={pieData} 
                                            innerRadius={70} 
                                            outerRadius={100} 
                                            paddingAngle={8} 
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-200 transition-colors duration-300">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
                <p className={`text-4xl font-black ${color}`}>{value}</p>
                <p className="text-xs text-slate-400 font-medium">Tiket</p>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 border-t pt-3 border-slate-50 font-medium">
                {desc}
            </p>
        </div>
    );
}