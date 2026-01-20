import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function FaqList({ auth, faqs }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);

    const { data, setData, patch, processing, errors, reset } = useForm({
        answer: '',
        is_published: false,
    });

    const openModal = (faq) => {
        setSelectedFaq(faq);
        setData({
            answer: faq.answer || '',
            is_published: !!faq.is_published,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFaq(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.faqs.update', selectedFaq.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen FAQ PTSP</h2>}
        >
            <Head title="Manajemen FAQ" />

            <div className="py-12 bg-slate-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Penanya</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Pertanyaan</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {faqs.map((faq) => (
                                    <tr key={faq.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800">{faq.user_name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">{faq.email || 'No Email'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-xs">{faq.question}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                                                faq.is_published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                                            }`}>
                                                {faq.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => openModal(faq)} className="text-blue-600 hover:text-blue-800 font-black text-[10px] uppercase tracking-widest">
                                                {faq.answer ? 'Edit Jawaban' : 'Jawab'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-8">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-4 border-b pb-4">Kelola FAQ</h3>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Pertanyaan:</p>
                        <p className="text-sm text-slate-700 font-medium italic">"{selectedFaq?.question}"</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <InputLabel htmlFor="answer" value="Jawaban Admin Resmi" />
                            <textarea
                                id="answer"
                                className="mt-1 block w-full border-slate-200 rounded-xl focus:ring-blue-500 text-sm"
                                rows="4"
                                value={data.answer}
                                onChange={(e) => setData('answer', e.target.value)}
                                placeholder="Masukkan jawaban untuk membantu user..."
                                required
                            ></textarea>
                            <InputError message={errors.answer} className="mt-1" />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_published"
                                checked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 shadow-sm focus:ring-blue-500"
                            />
                            <label htmlFor="is_published" className="text-xs font-black text-slate-600 uppercase tracking-widest cursor-pointer">Terbitkan ke Halaman Publik</label>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-blue-600">Simpan Perubahan</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}