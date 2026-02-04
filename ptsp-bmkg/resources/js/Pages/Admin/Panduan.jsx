import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Panduan() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-black leading-tight text-gray-800">
                    PANDUAN ADMIN
                </h2>
            }
        >
            <Head title="Panduan Penggunaan Sistem - Admin PTSP BMKG" />

            <div className="max-w-4xl mx-auto py-12 px-4">
                <h1 className="text-2xl font-black text-slate-900 mb-4">
                    Panduan Penggunaan Sistem PTSP
                </h1>

                <p className="text-slate-600 mb-8">
                    Halaman ini berisi panduan lengkap bagi admin dalam mengelola
                    permohonan data, verifikasi, dan layanan PTSP BMKG.
                </p>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-3">
                        Buku Panduan Admin
                    </h2>

                    <p className="text-slate-500 mb-6">
                        Silakan klik tautan berikut untuk membuka panduan lengkap
                        pengelolaan sistem PTSP dalam format Google Docs.
                    </p>

                    <a
                        href="https://docs.google.com/document/d/1Tg3iCvRX8IgYzbUkGfhxpMwjD3mtqhvaP1jArztmcDc/edit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 rounded-xl
                                   bg-blue-600 text-white font-bold text-sm
                                   hover:bg-blue-700 transition-colors"
                    >
                        Buka Panduan Admin
                    </a>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
