import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function LandingPage({ catalogs, auth }) {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
            <Head title="Beranda - PTSP BMKG Radin Inten II" />

            {/* --- NAVBAR (BARU) --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    {/* Brand/Logo */}
                    <div className="flex items-center gap-3">
                        {/* Ganti src dengan path logo BMKG jika sudah ada */}
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-100">?</div>
                        <div className="hidden md:block">
                            <h2 className="font-black text-slate-800 text-sm leading-tight uppercase tracking-tighter">PTSP BMKG</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Lampung</p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4 md:gap-8">
                        <a href="#how-it-works" className="hidden sm:block text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Prosedur</a>
                        <a href="#catalogs" className="hidden sm:block text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Katalog</a>
                        
                        {/* Tombol Login Admin */}
                        {auth.user ? (
                            <Link 
                                href={route('admin.dashboard')} 
                                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link 
                                href={route('login')} 
                                className="text-[10px] font-black text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors border-l border-slate-200 pl-4 md:pl-8"
                            >
                                Login Admin
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- SECTION 1: HERO SECTION --- */}
            <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-slate-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 blur-[120px] rounded-full -mr-48 -mt-24"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <span className="inline-flex items-center py-2 px-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-6 gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                PTSP Online BMKG Lampung
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter">
                                Akses Data Meteorologi <br />
                                <span className="text-blue-600">Mudah & Transparan.</span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
                                Platform resmi Stasiun Meteorologi Radin Inten II untuk permintaan data cuaca, iklim, dan jasa konsultasi meteorologi dengan sistem PNBP yang akuntabel.
                            </p>
                            <div className="flex gap-4 flex-wrap">
                                <Link href="/permohonan" className="bg-blue-600 text-white px-10 py-4 rounded-2xl hover:bg-blue-700 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-200 hover:-translate-y-1 transition-all flex items-center gap-3">
                                    Ajukan Permohonan 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                                <Link href="/cek-status" className="bg-white text-slate-700 px-10 py-4 rounded-2xl hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest border border-slate-200 shadow-sm transition-all flex items-center gap-2">
                                    Cek Status Tiket
                                </Link>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 relative group">
                            <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-10 rounded-full"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=2070&auto=format&fit=crop" 
                                alt="Ilustrasi Layanan BMKG" 
                                className="relative rounded-[3rem] shadow-2xl border-8 border-white transform rotate-2 group-hover:rotate-0 transition-all duration-700 w-full object-cover h-[500px]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: PROSEDUR --- */}
            <section id="how-it-works" className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">Alur Layanan</span>
                        <h2 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">Prosedur Permohonan Data</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="p-8">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl text-2xl font-black flex items-center justify-center mx-auto mb-8 shadow-inner">1</div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Pilih Layanan</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Lihat katalog layanan dan tentukan jenis data meteorologi yang Anda butuhkan.</p>
                        </div>
                        <div className="p-8">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl text-2xl font-black flex items-center justify-center mx-auto mb-8 shadow-inner">2</div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Isi Formulir</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Lengkapi identitas diri dan unggah berkas persyaratan seperti KTP atau Surat Pengantar.</p>
                        </div>
                        <div className="p-8">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl text-2xl font-black flex items-center justify-center mx-auto mb-8 shadow-inner">3</div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Terima Data</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Selesaikan pembayaran PNBP, dan data akan dikirimkan melalui sistem atau email.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 3: KATALOG LAYANAN (Dinamis dari Database) --- */}
            <section id="catalogs" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6 text-center">
                    <div className="mb-16">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Katalog Layanan & Tarif</h2>
                        <p className="text-slate-500 font-medium mt-2 italic text-sm">Berdasarkan PP No. 47 Tahun 2018 tentang Jenis dan Tarif PNBP yang berlaku pada BMKG.</p>
                    </div>
                    
                    <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                                        <th className="p-8 border-b">Jenis Informasi</th>
                                        <th className="p-8 border-b text-center">Satuan</th>
                                        <th className="p-8 border-b text-right">Tarif PNBP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {catalogs && catalogs.length > 0 ? catalogs.map((item, index) => (
                                        <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="p-8">
                                                <div className="font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors">{item.info_type}</div>
                                                <div className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tighter">{item.category}</div>
                                            </td>
                                            <td className="p-8 text-slate-500 text-center font-bold text-sm italic">{item.unit}</td>
                                            <td className="p-8 font-black text-right text-emerald-600 text-lg">
                                                Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">Katalog data belum tersedia.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: FAQ (Statis / Hardcoded) --- */}
            <section id="faq" className="py-32 bg-white">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">Pusat Bantuan</span>
                        <h2 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">Pertanyaan Umum</h2>
                    </div>

                    <div className="space-y-4">
                        <details className="bg-slate-50 p-6 rounded-[2rem] group cursor-pointer border border-transparent hover:border-blue-100 transition-all open:bg-white open:shadow-xl open:shadow-blue-100/20">
                            <summary className="font-bold text-slate-900 flex justify-between items-center list-none">
                                <span>Bagaimana cara mendapatkan tarif Rp 0 (Gratis) untuk mahasiswa?</span>
                                <span className="transition-transform duration-300 group-open:rotate-180 text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                                </span>
                            </summary>
                            <p className="text-slate-600 mt-4 leading-relaxed font-medium pt-4 border-t border-slate-100">
                                Tarif nol rupiah diberikan untuk penelitian pendidikan. Anda wajib melampirkan Surat Pengantar dari Dekan/Kampus yang menyatakan data tersebut tidak digunakan secara komersial.
                            </p>
                        </details>

                        <details className="bg-slate-50 p-6 rounded-[2rem] group cursor-pointer border border-transparent hover:border-blue-100 transition-all open:bg-white open:shadow-xl open:shadow-blue-100/20">
                            <summary className="font-bold text-slate-900 flex justify-between items-center list-none">
                                <span>Berapa lama masa aktif link unduh data?</span>
                                <span className="transition-transform duration-300 group-open:rotate-180 text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                                </span>
                            </summary>
                            <p className="text-slate-600 mt-4 leading-relaxed font-medium pt-4 border-t border-slate-100">
                                Data meteorologi yang kami kirimkan akan aktif selama 3 hari kalender. Pastikan Anda segera mengunduh file setelah menerima transaksi selesai.
                            </p>
                        </details>

                        <details className="bg-slate-50 p-6 rounded-[2rem] group cursor-pointer border border-transparent hover:border-blue-100 transition-all open:bg-white open:shadow-xl open:shadow-blue-100/20">
                            <summary className="font-bold text-slate-900 flex justify-between items-center list-none">
                                <span>Apakah pembayaran bisa dilakukan melalui transfer ATM?</span>
                                <span className="transition-transform duration-300 group-open:rotate-180 text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                                </span>
                            </summary>
                            <p className="text-slate-600 mt-4 leading-relaxed font-medium pt-4 border-t border-slate-100">
                                Bisa. Pembayaran tarif PNBP menggunakan Kode Billing (Simponi) yang dapat dibayarkan melalui Bank persepsi, ATM, Kantor Pos, maupun aplikasi M-Banking.
                            </p>
                        </details>
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/faq" className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest border-b-2 border-blue-50 pb-1 transition-colors">
                            Lihat Semua FAQ & Tanya Admin →
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-16 bg-slate-900 text-white border-t border-slate-800">
                <div className="container mx-auto px-6 text-center">
                    <div className="mb-8">
                        <h4 className="text-xl font-black uppercase tracking-[0.3em] mb-2 text-blue-500">PTSP BMKG LAMPUNG</h4>
                        <p className="text-slate-500 font-medium">Stasiun Meteorologi Radin Inten II - Branti</p>
                    </div>
                    <div className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] pt-8 border-t border-slate-800/50">
                        &copy; 2026 Badan Meteorologi Klimatologi dan Geofisika. Semua Hak Dilindungi.
                    </div>
                </div>
            </footer>
        </div>
    );
}