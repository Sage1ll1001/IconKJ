"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { User, Shield, Clock, Wallet } from 'lucide-react';

export default function Profile() {
    const [user, setUser] = useState<any>(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('microshare_user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            fetchTransactions(userData.id);
        } else {
            setLoading(false);
        }
    }, []);

    async function fetchTransactions(userId: string) {
        // In a real app, create a real API for this. 
        // For now, we will mock or fetch if possible. 
        // Let's assume we can fetch user transactions if we added an endpoint
        // OR we can just show simulate empty for now or add an endpoint.

        // Let's create an endpoint quickly via the write_to_file next step or simulate
        setLoading(false);
        // mocking locally for UI demo 
        setTransactions([
            { id: '1', type: 'DEPOSIT', amount: 1000, date: '2023-10-25', status: 'SUCCESS', stock: '-' },
        ] as any);
    }

    if (!user && !loading) return <div className="text-white text-center p-20">Please Sign In</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            <Navbar />

            <main className="container mx-auto p-6 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <User className="text-blue-500" /> My Profile
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 md:col-span-2">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{user?.name}</h2>
                                <p className="text-slate-400">{user?.email}</p>
                                <span className="inline-block mt-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {user?.role} Account
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2 text-slate-400">
                            <Wallet size={20} /> Current Balance
                        </div>
                        <div className="text-4xl font-bold text-emerald-400">
                            ₹{Number(user?.balance || 0).toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Clock size={20} className="text-slate-400" /> Transaction History
                        </h3>
                    </div>
                    <div>
                        {transactions.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No transactions found.</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-950/50 text-slate-400 text-sm">
                                    <tr>
                                        <th className="p-4">Type</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx: any) => (
                                        <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                                            <td className="p-4">
                                                <span className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-blue-400'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="p-4">₹{tx.amount}</td>
                                            <td className="p-4">
                                                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-bold">
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-400">{tx.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
