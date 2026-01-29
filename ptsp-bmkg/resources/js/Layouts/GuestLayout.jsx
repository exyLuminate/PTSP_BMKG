import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-50 pt-6 sm:justify-center sm:pt-0">

            <div className="mt-6 w-full overflow-hidden bg-white px-8 py-10 shadow-xl shadow-slate-200/50 sm:max-w-md sm:rounded-2xl border border-slate-100">
                {children}
            </div>

            <footer className="mt-8 text-center">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                    &copy; 2026 BMKG Lampung - PTSP Stasiun Meteorologi Radin Inten II
                </p>
            </footer>
        </div>
    );
}