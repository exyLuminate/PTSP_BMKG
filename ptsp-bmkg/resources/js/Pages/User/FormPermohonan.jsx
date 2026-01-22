import React, { useState } from 'react'; 
import { Head, useForm, Link } from '@inertiajs/react';

export default function FormPermohonan({ catalogs }) {
    const [showPassword, setShowPassword] = useState(false); 
    
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        nik: '',
        data_catalog_id: '',
        description: '', 
        quantity: 1,      
        password: '',
        ktp: null,
        letter: null,
    });

    const selectedCatalog = catalogs.find(c => c.id == data.data_catalog_id);
    const totalPrice = selectedCatalog ? selectedCatalog.price * data.quantity : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('permohonan.store'));
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 text-slate-900 font-sans">
            <Head title="Ajukan Permohonan - PTSP BMKG" />
            
            <div className="max-w-3xl mx-auto mb-8">
                <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 transition-transform group-hover:-translate-x-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Kembali ke Beranda
                </Link>
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-[3.5rem] shadow-2xl shadow-blue-100/50 border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Formulir Permohonan</h2>
                        <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Batas Maksimal Berkas 4MB (PDF)</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-12 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Nama Lengkap</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full mt-3 bg-slate-50 border-none rounded-[1.5rem] py-5 px-8 focus:ring-4 focus:ring-blue-500/10 font-bold text-sm text-slate-900 shadow-inner transition-all" placeholder="SESUAI KTP" required />
                        </div>
                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Email Aktif</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full mt-3 bg-slate-50 border-none rounded-[1.5rem] py-5 px-8 focus:ring-4 focus:ring-blue-500/10 font-bold text-sm text-slate-900 shadow-inner transition-all" placeholder="ALAMAT@EMAIL.COM" required />
                        </div>
                    </div>

                    <div className="group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">NIK (16 Digit)</label>
                        <input type="text" maxLength="16" value={data.nik} onChange={e => setData('nik', e.target.value)} className="w-full mt-3 bg-slate-50 border-none rounded-[1.5rem] py-5 px-8 focus:ring-4 focus:ring-blue-500/10 font-black text-sm tracking-[0.2em] text-slate-900 shadow-inner transition-all" placeholder="0000000000000000" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-3 group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Jenis Layanan Data</label>
                            <div className="relative mt-3">
                                <select 
                                    value={data.data_catalog_id} 
                                    onChange={e => setData('data_catalog_id', e.target.value)} 
                                    className="w-full bg-slate-50 bg-none border-none rounded-[1.5rem] py-5 px-8 focus:ring-4 focus:ring-blue-500/10 font-bold text-sm appearance-none text-slate-900 shadow-inner transition-all cursor-pointer" 
                                    required
                                >
                                    <option value="">PILIH KATALOG DATA...</option>
                                    {catalogs.map((item) => (
                                        <option key={item.id} value={item.id}>{item.info_type} - Rp {new Intl.NumberFormat('id-ID').format(item.price)}</option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors text-nowrap">Jumlah (Hari/Titik)</label>
                            <input type="number" min="1" value={data.quantity} onChange={e => setData('quantity', e.target.value)} className="w-full mt-3 bg-slate-50 border-none rounded-[1.5rem] py-5 px-8 focus:ring-4 focus:ring-blue-500/10 font-black text-sm text-slate-900 shadow-inner transition-all text-center" required />
                        </div>
                    </div>

                    <div className="group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Deskripsi Permintaan (Lokasi & Periode)</label>
                        <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="w-full mt-3 bg-slate-50 border-none rounded-[2rem] py-5 px-8 focus:ring-4 focus:ring-blue-500/10 font-bold text-sm text-slate-900 shadow-inner transition-all h-32 resize-none" placeholder="CONTOH: DATA CURAH HUJAN WILAYAH BANDAR LAMPUNG PERIODE JANUARI 2024..." required></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">KTP (PDF, MAX 4MB)</label>
                            <input type="file" onChange={e => setData('ktp', e.target.files[0])} accept=".pdf" className="w-full text-[10px] font-black text-slate-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white file:uppercase file:tracking-widest cursor-pointer" required />
                        </div>
                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Surat Permohonan (PDF, MAX 4MB)</label>
                            <input type="file" onChange={e => setData('letter', e.target.files[0])} accept=".pdf" className="w-full text-[10px] font-black text-slate-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white file:uppercase file:tracking-widest cursor-pointer" required />
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-[2.5rem] p-10 border border-blue-100 space-y-6">
                        <div className="flex justify-between items-center border-b border-blue-200 pb-6">
                            <span className="text-[11px] font-black text-blue-900 uppercase tracking-[0.2em]">Estimasi Total PNBP</span>
                            <span className="text-3xl font-black text-blue-600">Rp {new Intl.NumberFormat('id-ID').format(totalPrice)}</span>
                        </div>
                        <div className="group relative">
                            <label className="text-[10px] font-black text-blue-800 uppercase tracking-widest ml-1">Buat Password Akses Tiket</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={data.password} 
                                    onChange={e => setData('password', e.target.value)} 
                                    className="w-full mt-3 bg-white border-none rounded-[1.5rem] py-5 px-8 pr-16 focus:ring-4 focus:ring-blue-500/10 font-bold text-sm text-slate-900 shadow-sm transition-all" 
                                    placeholder="MINIMAL 6 KARAKTER" 
                                    required 
                                />
                                {}
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className="absolute right-6 top-1/2 -translate-y-1/2 mt-1.5 text-slate-300 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-200 transition-all uppercase text-[11px] tracking-[0.3em] active:scale-95 disabled:opacity-50">
                        {processing ? 'Sedang Memproses...' : 'Kirim Permohonan Data'}
                    </button>
                </form>
            </div>
        </div>
    );
}