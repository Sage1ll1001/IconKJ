"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'MINOR' | 'GUARDIAN'>('MINOR');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, role })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('microshare_user', JSON.stringify(data.user));
                // Force a reload or navigation to update Navbar state
                window.location.href = '/dashboard';
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Signup failed");
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
                        Join MicroShare
                    </h1>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 mb-1 text-sm">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:border-blue-500 outline-none transition"
                                placeholder="Enter your name"
                            />
                        </div>

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

                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Account Type</label>
                            <div className="flex bg-slate-800 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setRole('MINOR')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${role === 'MINOR' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Student / Minor
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('GUARDIAN')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${role === 'GUARDIAN' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Guardian
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Creating Account...' : 'Get Started'}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 text-sm mt-6">
                        Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Log in</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
