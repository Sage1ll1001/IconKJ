"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('microshare_user', JSON.stringify(data.user));
                window.location.href = '/dashboard';
            } else {
                alert(data.error || 'Login failed. Try "aarav@example.com"');
            }
        } catch (err) {
            console.error(err);
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            <Navbar />
            <main className="container mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
                <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-6 text-center">
                        Welcome Back
                    </h1>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 mb-1 text-sm">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:border-blue-500 outline-none transition"
                                placeholder="name@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Verifying...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg text-sm text-slate-400">
                        <p className="font-bold mb-1">Demo Credentials:</p>
                        <p>Student: aarav@example.com</p>
                        <p>Guardian: guardian@example.com</p>
                    </div>

                    <p className="text-center text-slate-500 text-sm mt-6">
                        New to MicroShare? <Link href="/signup" className="text-blue-400 hover:underline">Create Account</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
