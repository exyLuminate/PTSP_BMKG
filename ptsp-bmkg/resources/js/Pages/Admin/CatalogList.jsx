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

    // Update default category agar sesuai dengan opsi baru
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
            reset();
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
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Katalog Layanan</h2>
                    <PrimaryButton onClick={() => openModal()}>
                        + Tambah Layanan
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Manajemen Katalog" />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Informasi</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Satuan</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarif PNBP</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {catalogs.map((catalog) => (
                                    <tr key={catalog.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{catalog.info_type}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-tighter shadow-sm border ${getCategoryStyle(catalog.category)}`}>
                                                {catalog.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">{catalog.unit}</td>
                                        <td className="px-6 py-4 text-sm font-black text-emerald-600">
                                            Rp {new Intl.NumberFormat('id-ID').format(catalog.price)}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-4">
                                            <button onClick={() => openModal(catalog)} className="text-blue-600 hover:text-blue-800 font-black text-[10px] uppercase tracking-widest">Edit</button>
                                            <button onClick={() => handleDelete(catalog.id)} className="text-red-500 hover:text-red-700 font-black text-[10px] uppercase tracking-widest">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form Tambah/Edit */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-8">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-6 border-b pb-4">
                        {editingCatalog ? 'Perbarui Layanan' : 'Tambah Layanan Baru'}
                    </h3>

                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="info_type" value="Nama Jenis Informasi" />
                            <TextInput
                                id="info_type"
                                className="mt-1 block w-full border-slate-200"
                                value={data.info_type}
                                onChange={(e) => setData('info_type', e.target.value)}
                                placeholder="Contoh: Kegiatan Olah Raga"
                                required
                            />
                            <InputError message={errors.info_type} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="category" value="Kategori Layanan Resmi" />
                            <select
                                id="category"
                                className="mt-1 block w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm text-sm font-bold text-slate-700"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                            >
                                <option value="INFORMASI METEOROLOGI">Informasi Meteorologi</option>
                                <option value="INFORMASI KHUSUS METEOROLOGI">Informasi Khusus Meteorologi</option>
                                <option value="JASA KONSULTASI METEOROLOGI">Jasa Konsultasi Meteorologi</option>
                            </select>
                            <InputError message={errors.category} className="mt-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="unit" value="Satuan" />
                                <TextInput
                                    id="unit"
                                    className="mt-1 block w-full border-slate-200"
                                    value={data.unit}
                                    onChange={(e) => setData('unit', e.target.value)}
                                    placeholder="per lokasi - per hari"
                                    required
                                />
                                <InputError message={errors.unit} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="price" value="Tarif PNBP (Rp)" />
                                <TextInput
                                    id="price"
                                    type="number"
                                    className="mt-1 block w-full border-slate-200"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="0"
                                    required
                                />
                                <InputError message={errors.price} className="mt-1" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                            {editingCatalog ? 'Simpan Perubahan' : 'Simpan Katalog'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

/** * Fungsi Helper untuk styling kategori menggunakan Keyword Matching
 */
function getCategoryStyle(category) {
    const cat = category ? category.toUpperCase() : '';

    if (cat.includes('KHUSUS')) {
        return 'bg-purple-50 text-purple-700 border-purple-200';
    } 
    if (cat.includes('KONSULTASI') || cat.includes('JASA')) {
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (cat.includes('METEOROLOGI')) {
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }

    return 'bg-slate-50 text-slate-600 border-slate-200';
}