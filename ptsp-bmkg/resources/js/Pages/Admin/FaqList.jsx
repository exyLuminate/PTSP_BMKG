import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function FaqList({ auth, faqs }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);

    // Inisialisasi Form
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
            header={<h2 className="font-black text-xl text-slate-800 tracking-tight uppercase leading-tight">Manajemen FAQ PTSP</h2>}
        >
            <Head title="Manajemen FAQ" />

            <div className="py-6 sm:py-12 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* --- VIEW MOBILE (CARD LAYOUT) --- */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {faqs?.data?.map((faq) => (
                            <div key={faq.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200">
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 leading-tight">{faq.user_name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{faq.email || 'No Email'}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${
                                        faq.is_published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}>
                                        {faq.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                
                                <div className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pertanyaan:</p>
                                    <p className="text-sm text-slate-700 leading-relaxed italic">"{faq.question}"</p>
                                </div>

                                <button 
                                    onClick={() => openModal(faq)} 
                                    className="w-full bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                                >
                                    {faq.answer ? 'Edit Jawaban' : 'Berikan Jawaban'}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* --- VIEW DESKTOP (TABLE LAYOUT) --- */}
                    <div className="hidden md:block bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Penanya</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Pertanyaan</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {faqs?.data?.map((faq) => (
                                    <tr key={faq.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-bold text-slate-800">{faq.user_name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{faq.email || 'No Email'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 truncate max-w-xs">{faq.question}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${
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

                    {/* --- KOMPONEN PAGINATION (FIXED NULL ERROR) --- */}
                    {faqs?.links && (
                        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Menampilkan <span className="text-slate-800">{faqs.from || 0}</span> - <span className="text-slate-800">{faqs.to || 0}</span> dari <span className="text-slate-800">{faqs.total}</span> Data
                            </div>

                            <nav className="flex flex-wrap justify-center gap-1.5">
                                {faqs.links.map((link, index) => {
                                    const cleanLabel = link.label
                                        .replace('&laquo; Previous', '←')
                                        .replace('Next &raquo;', '→');

                                    // Render Link jika URL ada, render Span jika URL null (menghindari error toString)
                                    return link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                            className={`
                                                min-w-[38px] h-[38px] flex items-center justify-center rounded-xl text-[10px] font-black transition-all border
                                                ${link.active 
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                                                    : 'bg-white text-slate-400 border-slate-200 hover:border-blue-400 hover:text-blue-600 active:scale-90'
                                                }
                                            `}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                            className="min-w-[38px] h-[38px] flex items-center justify-center rounded-xl text-[10px] font-black border border-slate-100 text-slate-200 cursor-not-allowed opacity-50"
                                        />
                                    );
                                })}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL FAQ (CENTERED) --- */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="lg">
                <form onSubmit={submit} className="p-8 text-center">
                    <div className="mx-auto w-16 h-1 bg-blue-600 rounded-full mb-6 opacity-20"></div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Kelola FAQ</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Respons Admin PTSP BMKG</p>
                    
                    <div className="text-left space-y-6">
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest italic">Pertanyaan User:</p>
                            <p className="text-sm text-slate-700 font-bold italic leading-relaxed">"{selectedFaq?.question}"</p>
                        </div>

                        <div>
                            <InputLabel htmlFor="answer" value="Jawaban Resmi Admin" className="font-black text-[10px] uppercase text-slate-400 ml-1 mb-2" />
                            <textarea
                                id="answer"
                                className="mt-1 block w-full border-slate-200 rounded-2xl focus:ring-blue-500 text-sm font-medium bg-slate-50/50 focus:bg-white transition-all h-32"
                                value={data.answer}
                                onChange={(e) => setData('answer', e.target.value)}
                                placeholder="Masukkan jawaban bantuan..."
                                required
                            ></textarea>
                            <InputError message={errors.answer} className="mt-1" />
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                            <input
                                type="checkbox"
                                id="is_published"
                                checked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                            />
                            <label htmlFor="is_published" className="text-[11px] font-black text-slate-600 uppercase tracking-widest cursor-pointer select-none">Terbitkan ke FAQ Publik</label>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-3">
                        <PrimaryButton disabled={processing} className="w-full justify-center bg-blue-600 py-4 rounded-2xl shadow-lg shadow-blue-100 font-black text-[11px] tracking-widest uppercase">
                            SIMPAN JAWABAN
                        </PrimaryButton>
                        <SecondaryButton onClick={closeModal} className="w-full justify-center border-none text-slate-400 font-bold py-2 tracking-widest text-[10px] uppercase">
                            BATALKAN
                        </SecondaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}