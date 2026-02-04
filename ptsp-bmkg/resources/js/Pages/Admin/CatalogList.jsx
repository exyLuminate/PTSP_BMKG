import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CatalogList({ auth, catalogs }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCatalog, setEditingCatalog] = useState(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        info_type: '',
        category: 'Informasi Meteorologi',
        unit: '',
        price: '',
    });

    const openModal = (catalog = null) => {
    setEditingCatalog(catalog);
    if (catalog) {
        setData({
            info_type: catalog.info_type,
            category: catalog.category,
            unit: catalog.unit,
            price: catalog.price,
        });
    } else {
        setData({
            info_type: '',
            category: 'Informasi Meteorologi', 
            unit: '',
            price: '',
        });
    }
    setIsModalOpen(true);
};

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCatalog(null);
        clearErrors();
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingCatalog) {
            patch(route('admin.catalogs.update', editingCatalog.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.catalogs.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus item ini dari katalog?')) {
            destroy(route('admin.catalogs.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="font-black text-xl text-slate-800 tracking-tight uppercase">Katalog Layanan PNBP</h2>
                    <PrimaryButton onClick={() => openModal()} className="w-full sm:w-auto justify-center bg-blue-600">
                        + Tambah Layanan
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Manajemen Katalog" />

            <div className="py-6 sm:py-12 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* --- VIEW MOBILE (CARD LAYOUT) --- */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {catalogs.map((catalog) => (
                            <div key={catalog.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200">
                                {/* Baris Atas: Kategori & Harga Sejajar */}
                                <div className="flex justify-between items-center gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border shadow-sm ${getCategoryStyle(catalog.category)}`}>
                                        {catalog.category}
                                    </span>
                                    <p className="text-sm font-black text-emerald-600 whitespace-nowrap">
                                        Rp {new Intl.NumberFormat('id-ID').format(catalog.price)}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-base font-bold text-slate-800 leading-tight mb-1">{catalog.info_type}</h4>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Per {catalog.unit}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-4">
                                    <button onClick={() => openModal(catalog)} className="bg-slate-50 text-blue-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 active:scale-95 transition-transform text-center">Edit</button>
                                    <button onClick={() => handleDelete(catalog.id)} className="bg-white text-red-500 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-50 active:scale-95 transition-transform text-center">Hapus</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- VIEW DESKTOP (TABLE LAYOUT) --- */}
                    <div className="hidden md:block bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Informasi</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Satuan</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarif PNBP</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {catalogs.map((catalog) => (
                                    <tr key={catalog.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{catalog.info_type}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide shadow-sm border whitespace-nowrap ${getCategoryStyle(catalog.category)}`}>
                                                {catalog.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-medium uppercase tracking-wider">{catalog.unit}</td>
                                        <td className="px-6 py-4 text-sm font-black text-emerald-600">
                                            Rp {new Intl.NumberFormat('id-ID').format(catalog.price)}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-4">
                                            <button onClick={() => openModal(catalog)} className="text-blue-600 hover:text-blue-800 font-black text-[10px] uppercase tracking-widest transition-colors">Edit</button>
                                            <button onClick={() => handleDelete(catalog.id)} className="text-red-500 hover:text-red-700 font-black text-[10px] uppercase tracking-widest transition-colors">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL EDIT/TAMBAH (CENTERED CONTENT) --- */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-8 text-center">
                    <div className="mx-auto w-16 h-1 bg-blue-600 rounded-full mb-6 opacity-20"></div>
                    
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">
                        {editingCatalog ? 'Edit Layanan' : 'Layanan Baru'}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 italic">
                        Pastikan data tarif sesuai dengan PP PNBP berlaku
                    </p>

                    <div className="space-y-6 text-left">
                        <div>
                            <InputLabel htmlFor="info_type" value="Nama Jenis Informasi" className="font-black text-[10px] uppercase text-slate-400 ml-1" />
                            <TextInput
                                id="info_type"
                                className="mt-1 block w-full border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white transition-all text-sm font-bold"
                                value={data.info_type}
                                onChange={(e) => setData('info_type', e.target.value)}
                                placeholder="Misal: Data Curah Hujan"
                                required
                            />
                            <InputError message={errors.info_type} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="category" value="Kategori Resmi" className="font-black text-[10px] uppercase text-slate-400 ml-1" />
                            <select
                                id="category"
                                className="mt-1 block w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-2xl shadow-sm text-sm font-bold text-slate-700 h-12 px-4 bg-slate-50/50"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                            >
                                <option value="Informasi Meteorologi">Informasi Meteorologi</option>
                                <option value="Informasi Khusus Meteorologi">Informasi Khusus Meteorologi</option>
                                <option value="Jasa Konsultasi Meteorologi">Jasa Konsultasi Meteorologi</option>
                            </select>
                            <InputError message={errors.category} className="mt-1" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="unit" value="Satuan" className="font-black text-[10px] uppercase text-slate-400 ml-1" />
                                <TextInput
                                    id="unit"
                                    className="mt-1 block w-full border-slate-200 rounded-2xl bg-slate-50/50 text-sm font-bold"
                                    value={data.unit}
                                    onChange={(e) => setData('unit', e.target.value)}
                                    placeholder="per lokasi"
                                    required
                                />
                                <InputError message={errors.unit} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="price" value="Tarif (Rp)" className="font-black text-[10px] uppercase text-slate-400 ml-1" />
                                <TextInput
                                    id="price"
                                    type="number"
                                    className="mt-1 block w-full border-slate-200 rounded-2xl bg-slate-50/50 text-sm font-black text-emerald-600"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="0"
                                    required
                                />
                                <InputError message={errors.price} className="mt-1" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-3">
                        <PrimaryButton disabled={processing} className="w-full justify-center bg-blue-600 py-4 rounded-2xl shadow-lg shadow-blue-100">
                            {editingCatalog ? 'SIMPAN PERUBAHAN' : 'TAMBAHKAN KE KATALOG'}
                        </PrimaryButton>
                        <SecondaryButton onClick={closeModal} className="w-full justify-center border-none text-slate-400 font-bold py-2">
                            BATALKAN
                        </SecondaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

function getCategoryStyle(category) {
    const cat = category ? category.toUpperCase() : '';
    if (cat.includes('KHUSUS')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (cat.includes('KONSULTASI') || cat.includes('JASA')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (cat.includes('METEOROLOGI')) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
}