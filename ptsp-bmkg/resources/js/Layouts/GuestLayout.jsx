import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-50 pt-6 sm:justify-center sm:pt-0">
            <div className="flex flex-col items-center mb-4 text-center">
                <Link href="/">
                    <ApplicationLogo className="h-28 w-auto fill-current text-gray-500" />
                </Link>
                <div className="mt-4">
                    <h2 className="text-xl font-extrabold text-slate-800 leading-tight">
                        BMKG
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                        Stasiun Meteorologi Radin Inten II
                    </p>
                </div>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-8 py-10 shadow-xl shadow-slate-200/50 sm:max-w-md sm:rounded-2xl border border-slate-100">
                {children}
            </div>

            <footer className="mt-8 text-center">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                    &copy; 2026 BMKG Lampung - PTSP Digital Ecosystem
                </p>
            </footer>
        </div>
    );
}