import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login Admin - PTSP BMKG" />

            {/* Header Identitas Portal */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-blue-900 tracking-tight">Portal Admin</h1>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-semibold">
                    PTSP Stasiun Meteorologi Radin Inten II
                </p>
                <div className="h-1 w-12 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email Dinas" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="test@gmail.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ms-2 text-sm text-gray-600">Ingat Sesi Saya</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-blue-600 hover:text-blue-800 transition duration-150"
                        >
                            Lupa Password?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center bg-blue-700 hover:bg-blue-800 py-3 text-sm font-bold shadow-lg shadow-blue-100" 
                        disabled={processing}
                    >
                        Masuk ke Dashboard
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
                <Link
                    href="/"
                    className="text-xs text-gray-400 hover:text-blue-600 transition uppercase font-bold tracking-tighter"
                >
                    &larr; Kembali ke Beranda Publik
                </Link>
            </div>
        </GuestLayout>
    );
}