import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, notifications } = usePage().props;
    const user = auth.user;
    
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        /* Tambahkan flex flex-col agar footer bisa didorong ke bawah */
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('admin.dashboard')}>
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-blue-600" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('admin.dashboard')}
                                    active={route().current('admin.dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                
                                <NavLink
                                    href={route('admin.requests.index')}
                                    active={route().current('admin.requests.*')}
                                >
                                    <span className="relative py-2">
                                        Daftar Permintaan
                                        {notifications?.pending_count > 0 && (
                                            <span className="absolute -top-1 -right-5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-sm animate-pulse z-10">
                                                {notifications.pending_count}
                                            </span>
                                        )}
                                    </span>
                                </NavLink>

                                <NavLink href={route('admin.faqs.index')} active={route().current('admin.faqs.*')}>
                                    FAQ
                                </NavLink>

                                <NavLink href={route('admin.reports.index')} active={route().current('admin.reports.*')}>
                                    Laporan
                                </NavLink>
                                
                                <NavLink href={route('admin.catalogs.index')} active={route().current('admin.catalogs.*')}>
                                    Katalog Layanan
                                </NavLink>

                                <NavLink href={route('admin.logs.index')} active={route().current('admin.logs.*')}>
                                    Log Aktivitas
                                </NavLink>

                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-bold leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:outline-none relative"
                            >
                                {notifications?.pending_count > 0 && !showingNavigationDropdown && (
                                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-600 rounded-full animate-ping"></span>
                                )}
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        
                        <ResponsiveNavLink 
                            href={route('admin.requests.index')} 
                            active={route().current('admin.requests.*')}
                            className="flex justify-between items-center"
                        >
                            Daftar Permintaan
                            {notifications?.pending_count > 0 && (
                                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                    {notifications.pending_count}
                                </span>
                            )}
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('admin.faqs.index')} active={route().current('admin.faqs.*')}>
                            Manajemen FAQ
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('admin.reports.index')} active={route().current('admin.reports.*')}>
                            Laporan
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('admin.catalogs.index')} active={route().current('admin.catalogs.*')}>
                            Katalog Layanan
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('admin.logs.index')} active={route().current('admin.logs.*')}>
                            Audit Trail
                        </ResponsiveNavLink>

                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Akun Saya</div>
                        <div className="px-4 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-[10px]">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-black text-gray-800 uppercase">{user.name}</div>
                                <div className="text-[10px] font-medium text-gray-500">{user.email}</div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile Settings</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-red-600 font-bold">Log Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow-sm border-b border-slate-100">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="animate-in fade-in duration-500">
                {children}
            </main>

            {/* --- FOOTER MINIMALIS: Diletakkan di sini --- */}
           <footer className="bg-white border-t border-slate-200 mt-auto py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} PTSP BMKG Lampung. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}