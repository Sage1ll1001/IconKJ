"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import StockChart from '@/components/StockChart';
import StockNews from '@/components/StockNews';
import AIAdvisor from '@/components/AIAdvisor';

export default function StockDetail() {
    const { id } = useParams();
    const [stock, setStock] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchStock() {
            if (!id) return;
            try {
                const res = await fetch(`/api/market/${id}`);
                if (!res.ok) throw new Error('Stock not found');
                const data = await res.json();
                setStock(data);
            } catch (error) {
                console.error("Failed to fetch stock", error);
                setMessage("Failed to load stock details");
            }
        }
        fetchStock();
    }, [id]);

    const handleTrade = async () => {
        const storedUser = localStorage.getItem('microshare_user');
        if (!storedUser) {
            setMessage("Please Sign In first to trade!");
            return;
        }
        const user = JSON.parse(storedUser);

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setMessage("Please enter a valid amount");
            return;
        }

        try {
            const res = await fetch('/api/trade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    stockId: stock.id,
                    type: orderType,
                    amount: Number(amount),
                    priceAtTransaction: stock.price
                })
            });
            const data = await res.json();
            if (data.success) {
                setMessage(`Success! ${orderType} order placed for ₹${amount}`);
                setAmount('');
            } else {
                setMessage(`Error: ${data.message || 'Transaction failed'}`);
            }
        } catch (err) {
            console.error(err);
            setMessage("Transaction failed. Please try again.");
        }
    };

    if (!stock) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

    const estimatedShares = amount ? (Number(amount) / stock.price).toFixed(6) : "0";

    return (
        <div className="min-h-screen bg-[#0f1115] text-[#e3e3e3] font-sans">
            <Navbar />

            <main className="container mx-auto p-6 max-w-7xl">
                {/* Google Finance Style Header */}
                <div className="mb-6 border-b border-slate-800 pb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <div className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
                                <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">NSE</span>
                                <span>{stock.symbol}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-normal text-white mb-2">{stock.name}</h1>
                            <div className="flex items-baseline gap-4">
                                <span className="text-5xl md:text-6xl font-normal tracking-tight">₹{stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                <span className={`text-xl md:text-2xl font-medium flex items-center ${stock.change >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                    {stock.change >= 0 ? <TrendingUp size={24} className="ml-1" /> : <TrendingDown size={24} className="ml-1" />}
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm mt-2">Data provided by Yahoo Finance • Real-time (simulated)</p>
                        </div>

                        <div className="flex gap-3">
                            <button className="px-6 py-2 border border-slate-700 rounded-full hover:bg-slate-800 transition font-medium text-sm flex items-center gap-2">
                                <span className="text-blue-400">+</span> Follow
                            </button>
                            <button className="px-6 py-2 border border-slate-700 rounded-full hover:bg-slate-800 transition font-medium text-sm">
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Chart Section */}
                        <section>
                            <StockChart symbol={stock.symbol} basePrice={stock.price} />
                        </section>

                        {/* Key Statistics Grid */}
                        <section className="bg-slate-900/0 rounded-xl">
                            <h2 className="text-xl font-normal mb-4 border-l-4 border-blue-500 pl-3">Key Statistics</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-6 border-t border-slate-800 pt-6">
                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Previous Close</p>
                                    <p className="text-lg">₹{(stock.price / (1 + stock.change / 100)).toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Day Range</p>
                                    <p className="text-lg">₹{(stock.price * 0.98).toFixed(2)} - ₹{(stock.price * 1.02).toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Year Range</p>
                                    <p className="text-lg">₹{(stock.price * 0.7).toFixed(2)} - ₹{(stock.price * 1.3).toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Market Cap</p>
                                    <p className="text-lg">{(stock.price * 0.01).toFixed(2)}T INR</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Avg Volume</p>
                                    <p className="text-lg">{(Math.random() * 10).toFixed(2)}M</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm mb-1">P/E Ratio</p>
                                    <p className="text-lg">{(Math.random() * 30 + 10).toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Dividend Yield</p>
                                    <p className="text-lg">{(Math.random() * 2).toFixed(2)}%</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm mb-1">Primary Exchange</p>
                                    <p className="text-lg">NSE</p>
                                </div>
                            </div>
                        </section>

                        {/* AI Advisor - Clean Card */}
                        <section className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden p-1">
                            <AIAdvisor symbol={stock.symbol} price={stock.price} change={stock.change} />
                        </section>

                        {/* About Section */}
                        <section>
                            <h2 className="text-xl font-normal mb-4 border-l-4 border-purple-500 pl-3">About {stock.name}</h2>
                            <p className="text-slate-300 leading-7 text-lg font-light">{stock.description}</p>
                            <div className="mt-4 flex gap-4 text-sm text-blue-400">
                                <a href="#" className="hover:underline">Wikipedia</a>
                                <a href="#" className="hover:underline">Official Website</a>
                            </div>
                        </section>

                        {/* News Section */}
                        <section>
                            <StockNews symbol={stock.symbol} />
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Sidebar */}
                    <div className="space-y-6">
                        {/* Buy/Sell Module - Sticky */}
                        <div className="bg-[#1e2329] p-6 rounded-2xl border border-slate-700/50 sticky top-24 shadow-2xl">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Wallet size={18} className="text-blue-400" /> Trade {stock.symbol}
                            </h3>

                            <div className="flex gap-2 mb-6 bg-slate-900/50 p-1.5 rounded-xl">
                                <button
                                    onClick={() => setOrderType('BUY')}
                                    className={`flex-1 py-2.5 rounded-lg font-bold transition text-sm ${orderType === 'BUY' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                                >
                                    Buy
                                </button>
                                <button
                                    onClick={() => setOrderType('SELL')}
                                    className={`flex-1 py-2.5 rounded-lg font-bold transition text-sm ${orderType === 'SELL' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                                >
                                    Sell
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Investment Amount</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-400 transition">₹</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Min ₹100"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 pl-8 pr-4 text-white focus:outline-none focus:border-blue-500 transition font-mono text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Estimated Shares</span>
                                        <span className="font-mono text-white">{estimatedShares}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Fees (0.5%)</span>
                                        <span className="font-mono text-slate-300">₹{(Number(amount) * 0.005).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-slate-700/50 pt-3 flex justify-between text-base font-bold">
                                        <span className="text-slate-200">Total</span>
                                        <span className="font-mono text-blue-400">₹{amount || '0'}</span>
                                    </div>
                                </div>

                                {message && (
                                    <div className={`p-3 rounded-lg text-sm border ${message.includes('Success') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                        {message}
                                    </div>
                                )}

                                <button
                                    onClick={handleTrade}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-xl transform active:scale-95 ${orderType === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-red-600 hover:bg-red-500 shadow-red-900/20'}`}
                                >
                                    {orderType === 'BUY' ? 'Place Buy Order' : 'Place Sell Order'}
                                </button>

                                <p className="text-center text-xs text-slate-500 mt-2">
                                    Market is usually open 9:15 AM - 3:30 PM
                                </p>
                            </div>
                        </div>

                        {/* Compare Section */}
                        <div className="bg-[#1e2329] p-6 rounded-2xl border border-slate-700/50">
                            <h3 className="text-lg font-bold mb-4">You might also like</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-white">Stock {String.fromCharCode(65 + i)}</p>
                                                <p className="text-xs text-emerald-400">+{(Math.random() * 5).toFixed(2)}%</p>
                                            </div>
                                        </div>
                                        <span className="text-blue-400 font-bold text-xs border border-blue-500/30 px-2 py-1 rounded-full">+</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
