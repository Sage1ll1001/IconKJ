"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function GuardianDashboard() {
    const [loading, setLoading] = useState(true);
    const [minorData, setMinorData] = useState<any>(null);

    // Mock Guardian ID from seed
    const guardianId = "guardian-uuid-placeholder";

    useEffect(() => {
        // In a real app, we would fetch /api/guardian/minors
        // For now, let's mock the data structure we want to display
        // or fetch the minor's data if we had an endpoint for it.

        // Let's simluate fetching linked minor's data
        const mockMinorData = {
            name: "Aarav",
            balance: 1000.00,
            portfolioValue: 12500.50,
            recentTransactions: [
                { id: 1, type: 'BUY', stock: 'MRF', amount: 500, status: 'SUCCESS', date: '2023-10-27' },
                { id: 2, type: 'BUY', stock: 'RELIANCE', amount: 200, status: 'SUCCESS', date: '2023-10-26' },
            ],
            educationProgress: 1 // 1 quiz completed
        };

        setTimeout(() => {
            setMinorData(mockMinorData);
            setLoading(false);
        }, 500);

    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            <Navbar />

            <main className="container mx-auto p-6 space-y-8">
                <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Guardian Dashboard</h1>
                        <p className="text-slate-400">Monitoring: <span className="text-blue-400 font-bold">{minorData?.name || 'Loading...'}</span></p>
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg text-sm border border-emerald-500/20">
                        ✅ KYC Verified
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-slate-500 py-12">Loading minor's data...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Portfolio Overview */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                📊 Portfolio Overview
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-800 rounded-xl">
                                    <p className="text-slate-400 text-sm">Current Balance</p>
                                    <p className="text-2xl font-bold">₹{minorData.balance.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-slate-800 rounded-xl">
                                    <p className="text-slate-400 text-sm">Invested Value</p>
                                    <p className="text-2xl font-bold">₹{minorData.portfolioValue.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Education Progress */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                🎓 Education Progress
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xl">
                                    {minorData.educationProgress}
                                </div>
                                <div>
                                    <p className="font-bold">Modules Completed</p>
                                    <p className="text-slate-400 text-sm">Next Level: Intermediate Investor</p>
                                </div>
                            </div>
                            <div className="mt-4 w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full w-1/3"></div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="md:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-400 text-sm border-b border-slate-800">
                                        <th className="pb-3">Type</th>
                                        <th className="pb-3">Stock</th>
                                        <th className="pb-3">Amount</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {minorData.recentTransactions.map((tx: any) => (
                                        <tr key={tx.id} className="border-b border-slate-800/50 last:border-0">
                                            <td className="py-3 font-bold text-emerald-400">{tx.type}</td>
                                            <td className="py-3">{tx.stock}</td>
                                            <td className="py-3">₹{tx.amount}</td>
                                            <td className="py-3">
                                                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs">{tx.status}</span>
                                            </td>
                                            <td className="py-3 text-slate-400">{tx.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:col-span-2 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <h4 className="font-bold text-yellow-500">Pending Approvals</h4>
                                <p className="text-sm text-yellow-200/80">
                                    No high-value transactions pending approval at this moment.
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}
