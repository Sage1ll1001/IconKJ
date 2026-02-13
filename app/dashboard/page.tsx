"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import StockCard from '@/components/StockCard';

export default function Dashboard() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock User Data
    const user = {
        name: "Aarav",
        balance: 5000.00,
        portfolioValue: 12500.50,
        profit: 1200.50,
        profitPercent: 10.6
    };

    useEffect(() => {
        async function fetchStocks() {
            try {
                const res = await fetch('/api/market');
                const data = await res.json();
                setStocks(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch stocks", error);
                setLoading(false);
            }
        }
        fetchStocks();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            <Navbar />

            <main className="container mx-auto p-6 space-y-8">
                {/* Welcome Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold">Hello, {user.name} 👋</h1>
                        <p className="text-slate-400 mt-1">Ready to start your investment journey?</p>
                    </div>
                </div>

                {/* Portfolio Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-xl col-span-2">
                        <p className="text-blue-200 text-sm font-medium mb-1">Total Portfolio Value</p>
                        <h2 className="text-4xl font-bold text-white mb-4">₹{user.portfolioValue.toLocaleString()}</h2>
                        <div className="flex gap-4">
                            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                <p className="text-xs text-blue-200">Invested</p>
                                <p className="font-semibold">₹{(user.portfolioValue - user.profit).toLocaleString()}</p>
                            </div>
                            <div className="bg-emerald-500/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-emerald-500/30">
                                <p className="text-xs text-emerald-200">Profit</p>
                                <p className="font-semibold text-emerald-300">
                                    +₹{user.profit.toLocaleString()} ({user.profitPercent}%)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <p className="text-slate-400 text-sm font-medium mb-1">Wallet Balance</p>
                        <h2 className="text-3xl font-bold text-white mb-6">₹{user.balance.toLocaleString()}</h2>
                        <div className="space-y-3">
                            <button className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-medium transition">
                                Add Funds
                            </button>
                            <button className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-lg font-medium transition border border-slate-700">
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>

                {/* Market Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Trending Stocks</h2>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">View Markets &rarr;</button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Loading market data...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stocks.map((stock: any) => (
                                <StockCard key={stock.id} stock={stock} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
