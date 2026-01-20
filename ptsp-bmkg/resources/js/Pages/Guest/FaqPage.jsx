import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const AccordionItem = ({ faq, isOpen, onClick }) => (
    <div className={`transition-all duration-300 ${isOpen ? 'bg-blue-50/50 rounded-2xl mb-4 shadow-sm' : 'border-b border-slate-100'}`}>
        {/* BUTTON PERTANYAAN - Padding dikurangi dari py-8 ke py-5 */}
        <button
            onClick={onClick}
            className="w-full px-6 pt-4 pb-3 text-left flex justify-between items-center group transition-all"
            aria-expanded={isOpen}
        >
            <span className={`text-[17px] font-bold transition-colors duration-300 leading-snug ${isOpen ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-500'}`}>
                {faq.question}
            </span>
            
            {/* CONTAINER PANAH - Ukuran dikecilkan sedikit biar proporsional */}
            <div className={`flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-blue-600 border-blue-600 text-white rotate-180 shadow-md shadow-blue-100' : 'bg-white border-slate-200 text-slate-400 group-hover:border-blue-300 group-hover:text-blue-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        </button>

        {/* AREA JAWABAN */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {/* Jarak antara box putih dengan tombol diperkecil (pb-6) */}
            <div className="px-6 pb-6 text-slate-600 leading-relaxed text-[15px]">
                
                {/* BOX PUTIH JAWABAN - Padding vertikal dikurangi dari py-10 ke py-6 */}
                <div className="py-6 px-7 bg-white rounded-xl border border-blue-100 shadow-sm text-center font-medium">
                    {faq.answer}
                </div>

            </div>
        </div>
    </div>
);

export default function FaqPage({ faqs }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(null);

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        user_name: '',
        email: '',
        question: '',
    });

    const filteredFaqs = useMemo(() => {
        return faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, faqs]);

    const submit = (e) => {
        e.preventDefault();
        post(route('faq.store'), {
            onSuccess: () => {
                setTimeout(() => {
                    setIsModalOpen(false);
                    reset();
                }, 2000);
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 selection:bg-blue-100">
            <Head title="Pusat Bantuan - FAQ PTSP BMKG" />

            <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800 tracking-tight">Help Center</span>
                    </div>
                    <Link href="/" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2">
                        Kembali
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 pt-4 tracking-tight">
                        Apa yang bisa kami <span className="text-blue-600">bantu?</span>
                    </h1>
                    <div className="relative max-w-2xl mx-auto backdrop-blur-sm">
                        <input
                            type="text"
                            placeholder="Cari topik bantuan..."
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 shadow-sm rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden mb-20">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <AccordionItem
                                key={faq.id}
                                faq={faq}
                                isOpen={activeIndex === index}
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <div className="text-slate-400 mb-2">¯\_(ツ)_/¯</div>
                            <p className="text-slate-500 font-medium">Pertanyaan tidak ditemukan.</p>
                        </div>
                    )}
                </div>

               {/* Section CTA - Sekarang tanpa boxing, menyatu dengan background */}
                <section className="py-20 text-center relative overflow-hidden border-t border-slate-100">
                    {/* Efek Glow dibuat sangat subtle di atas background terang */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 blur-[120px] -mr-40 -mt-40"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 blur-[120px] -ml-40 -mb-40"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 mt-8 tracking-tight">
                            Masih punya pertanyaan?
                        </h2>
                        <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed font-medium">
                            Jangan ragu untuk menghubungi tim kami jika Anda tidak menemukan jawaban yang dicari.
                        </p>
                        
                        {/* Tombol tetap biru BMKG karena kamu suka, tapi shadow disesuaikan agar tidak kaku */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-2xl hover:bg-blue-700 hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] active:scale-95 overflow-hidden"
                        >
                            {/* Efek Kilatan (Shine) */}
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                            
                            <span className="relative flex items-center gap-2">
                                Hubungi Admin
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </section>
            </main>

            {/* Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg">
                <form onSubmit={submit} className="p-8">
                    {recentlySuccessful ? (
                        <div className="py-12 text-center animate-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Pesan Terkirim</h3>
                            <p className="text-slate-500 mt-2">Terima kasih, kami akan segera merespons email Anda.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-slate-900">Ajukan Pertanyaan</h3>
                                <p className="text-slate-500 text-sm">Tim kami akan membantu Anda dalam waktu singkat.</p>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="user_name" value="Nama Lengkap" className="text-slate-700 font-medium ml-1" />
                                        <TextInput
                                            id="user_name"
                                            className="w-full border-slate-200 focus:ring-blue-500/20"
                                            value={data.user_name}
                                            onChange={e => setData('user_name', e.target.value)}
                                            placeholder="Masukkan nama Anda"
                                            required
                                        />
                                        <InputError message={errors.user_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <InputLabel htmlFor="email" value="Email" className="text-slate-700 font-medium ml-1" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="w-full border-slate-200 focus:ring-blue-500/20"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="contoh@mail.com"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <InputLabel htmlFor="question" value="Detail Pertanyaan" className="text-slate-700 font-medium ml-1" />
                                    <textarea
                                        id="question"
                                        className="w-full border-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all min-h-[120px] p-3 text-slate-700 text-sm"
                                        value={data.question}
                                        onChange={e => setData('question', e.target.value)}
                                        placeholder="Jelaskan kendala atau hal yang ingin Anda tanyakan..."
                                        required
                                    ></textarea>
                                    <InputError message={errors.question} />
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-end gap-3">
                                <SecondaryButton onClick={() => setIsModalOpen(false)} type="button" className="border-none hover:bg-slate-100">
                                    Batal
                                </SecondaryButton>
                                <PrimaryButton disabled={processing} className="bg-blue-600 hover:bg-blue-700 px-8 py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all">
                                    {processing ? 'Mengirim...' : 'Kirim Sekarang'}
                                </PrimaryButton>
                            </div>
                        </>
                    )}
                </form>
            </Modal>
        </div>
    );
}