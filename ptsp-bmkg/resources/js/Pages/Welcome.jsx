import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function LandingPage({ catalogs, auth }) {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
            <Head title="Beranda - PTSP BMKG Radin Inten II" />

            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block">
                            <h2 className="font-black text-slate-800 text-sm leading-tight uppercase tracking-tighter">Stasiun Meteorologi </h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kelas I Radin Inten II LAMPUNG</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                        <a href="#how-it-works" className="hidden sm:block text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Prosedur</a>
                        <a href="#catalogs" className="hidden sm:block text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Katalog</a>
                        
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

            <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-slate-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 blur-[120px] rounded-full -mr-48 -mt-24"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <span className="inline-flex items-center py-2 px-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-6 gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                PTSP Online 
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
                                    Permohonan Data 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                                <Link href="/cek-status" className="bg-white text-slate-700 px-10 py-4 rounded-2xl hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest border border-slate-200 shadow-sm transition-all flex items-center gap-2">
                                    Cek Status Tiket
                                </Link>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 flex flex-col items-center lg:items-center gap-8 relative">
                            <img 
                                src="/assets/img/logo_BMKG_resmi.png" 
                                alt="Logo BMKG" 
                                className="w-20 lg:w-44 h-auto drop-shadow-md animate-fade-in"
                            />
                            
                            <div className="relative group w-full">
                                <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-10 rounded-full"></div>
                                <img 
                                    src="/assets/img/landing.jpg" 
                                    alt="Ilustrasi Layanan BMKG" 
                                    className="relative rounded-[3rem] shadow-2xl border-8 border-white transform rotate-1 group-hover:rotate-0 transition-all duration-700 w-full aspect-[1024/572] object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">Alur Layanan</span>
                        <h2 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">Prosedur Permohonan Data</h2>
                    </div>
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="hidden md:block absolute top-1/3 left-[28%] z-0 text-blue-200">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                             </svg>
                        </div>
                        <div className="hidden md:block absolute top-1/3 left-[61%] z-0 text-blue-200">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                             </svg>
                        </div>

                        <div className="p-8 relative z-10">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl text-2xl font-black flex items-center justify-center mx-auto mb-8 shadow-inner">1</div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Pilih Layanan</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Lihat katalog layanan dan tentukan jenis data meteorologi yang Anda butuhkan.</p>
                        </div>
                        <div className="p-8 relative z-10">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl text-2xl font-black flex items-center justify-center mx-auto mb-8 shadow-inner">2</div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Isi Formulir</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Lengkapi identitas diri (KTP) dan unggah berkas permohonan data.</p>
                        </div>
                        <div className="p-8 relative z-10">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl text-2xl font-black flex items-center justify-center mx-auto mb-8 shadow-inner">3</div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Terima Data</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Selesaikan pembayaran PNBP, data akan dikirimkan melalui sistem.</p>
                        </div>
                    </div>
                </div>
            </section>

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
                                Data meteorologi yang kami kirimkan akan aktif selama 14 hari kalender. Pastikan Anda segera mengunduh file setelah menerima transaksi selesai.
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

            <footer className="relative py-20 bg-slate-900 text-white border-t border-slate-800 overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -ml-32 -mt-32"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                        
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-3">
                        <img src="/assets/img/logo_BMKG_resmi.png" alt="Logo" className="w-12 h-auto brightness-110" />
                        <div>
                            <h4 className="text-lg font-black leading-tight tracking-tighter uppercase">
                                Stasiun Meteorologi <br />
                                <span className="text-blue-500">Radin Inten II Lampung</span>
                            </h4>
                        </div>
                    </div>
    
                    <a 
                        href="https://maps.google.com/?cid=10817483895236941131&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNl" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-blue-500/50 transition-all group cursor-pointer block"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Lokasi Kami</p>
                            <p className="text-sm text-slate-400 leading-relaxed italic group-hover:text-slate-200 transition-colors">
                                Jl. Alamsyah Ratu Prawira Negara Km. 28 Branti, Natar, Lampung Selatan.
                            </p>
                        </div>
                    </a>
                </div>

                        <div className="lg:col-span-4 space-y-6">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Hubungi Layanan</h5>
                            <div className="space-y-4">
                                <a href="https://wa.me/6282363353482" className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-current">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm italic">
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">Call Center (WA)</p>
                                        <p className="font-bold text-slate-200">+62 823-6335-3482</p>
                                    </div>
                                </a>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <div className="text-sm italic">
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">Email Resmi</p>
                                        <p className="font-bold text-slate-200">bmkg.stametlampung@yahoo.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3 space-y-6">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Media Digital</h5>
                            <div className="flex flex-col gap-3">
                                <a 
                                    href="https://www.instagram.com/bmkglampung" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 transition-all group border border-white/5 shadow-sm"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:bg-white group-hover:text-pink-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">bmkglampung</span>
                                </a>

                                <a 
                                    href="https://lampung.bmkg.go.id" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all group border border-white/5 shadow-sm"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="2" y1="12" x2="22" y2="12"></line>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">lampung.bmkg.go.id</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                        <p>&copy; 2026 BMKG - Stasiun Meteorologi Radin Inten II</p>
                        <p className="text-blue-500/50">by Informatics Engineering 23, University of Lampung</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}