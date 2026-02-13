"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('microshare_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = async () => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'aarav@example.com' })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('microshare_user', JSON.stringify(data.user));
                setUser(data.user);
                window.location.reload(); // Refresh to update UI context
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error(error);
            alert('Login error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('microshare_user');
        setUser(null);
        router.push('/');
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
                    MicroShare
                </Link>
                <div className="space-x-6 flex items-center">
                    <Link href="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
                    <Link href="/market" className="hover:text-blue-400 transition">Market</Link>
                    <Link href="/education" className="hover:text-blue-400 transition">Learn</Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                ₹{Number(user.balance).toLocaleString()}
                            </span>
                            <Link href="/profile" className="flex items-center gap-2 group">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold shadow-lg group-hover:shadow-blue-500/50 transition">
                                    {user.name.charAt(0)}
                                </div>
                            </Link>
                            <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 px-2 py-1 rounded">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login">
                                <button className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition">
                                    Login
                                </button>
                            </Link>
                            <Link href="/signup">
                                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-blue-500/20">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
