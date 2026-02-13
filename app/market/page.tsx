"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { TrendingUp, TrendingDown, Search, ArrowRight } from 'lucide-react';

export default function MarketListing() {
    const [stocks, setStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchStocks() {
            try {
                const res = await fetch('/api/market'); // This endpoint returns all stocks
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

    const filteredStocks = stocks.filter(stock =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
            <Navbar />

            <main className="container mx-auto p-6 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-2 animate-fade-in-up">
                            Market Trends
                        </h1>
                        <p className="text-slate-400">Discover and invest in India's top companies starting at ₹100.</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition" size={20} />
                        <input
                            type="text"
                            placeholder="Search stocks (e.g. Reliance, TCS)..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-slate-900 h-48 rounded-2xl border border-slate-800"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStocks.map((stock) => (
                            <Link href={`/market/${stock.id}`} key={stock.id} className="group">
                                <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1 relative overflow-hidden">

                                    {/* Decorative gradient blob */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors"></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                                {stock.symbol}
                                            </h3>
                                            <p className="text-sm text-slate-400 font-medium truncate max-w-[180px]">{stock.name}</p>
                                        </div>
                                        <div className={`flex flex-col items-end ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            <span className="text-lg font-bold">₹{stock.price.toLocaleString()}</span>
                                            <span className="text-xs font-bold flex items-center bg-slate-950/50 px-2 py-1 rounded-full mt-1 border border-white/5">
                                                {stock.change >= 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                                                {stock.change >= 0 ? '+' : ''}{stock.change}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                                            High Volatility
                                        </span>
                                        <span className="text-blue-400 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                            Trade <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {filteredStocks.length === 0 && (
                            <div className="col-span-full text-center py-20 text-slate-500">
                                <p className="text-xl">No stocks found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
