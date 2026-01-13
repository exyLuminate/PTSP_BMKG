import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function Dashboard({ auth, monthlyStats, paymentStats, summary }) {
    
    // Format nama bulan untuk sumbu X grafik [cite: 188]
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    // Pastikan data bulanan lengkap 1-12 bulan walaupun datanya 0
    const chartData = monthlyStats.map(item => ({
        name: monthNames[item.month],
        jumlah: item.total
    }));

    // Data untuk Pie Chart [cite: 135, 239]
    const pieData = [
        { name: 'Dibayar (Paid)', value: paymentStats.paid, color: '#10B981' },
        { name: 'Kedaluwarsa (Expired)', value: paymentStats.expired, color: '#EF4444' },
        { name: 'Proses (On Process)', value: paymentStats.on_process, color: '#F59E0B' },
        { name: 'Siap (Ready)', value: paymentStats.ready, color: '#3B82F6' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Admin PTSP BMKG</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Statistik Card Utama [cite: 187, 189] */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Permintaan" value={summary.total_requests} color="text-blue-600" />
                        <StatCard title="Butuh Verifikasi" value={summary.pending_verification} color="text-orange-500" />
                        <StatCard title="Sukses Bayar" value={paymentStats.paid} color="text-green-600" />
                        <StatCard title="Expired" value={paymentStats.expired} color="text-red-600" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bar Chart Bulanan [cite: 188] */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-700 mb-6">Tren Permintaan Data per Bulan</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="jumlah" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart Status [cite: 191, 239] */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-700 mb-6">Persentase Status Permohonan</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend iconType="circle" />
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

// Komponen Card Kecil untuk kebersihan kode
function StatCard({ title, value, color }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
    );
}