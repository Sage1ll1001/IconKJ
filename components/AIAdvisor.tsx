"use client";

import { useState, useEffect } from 'react';
import { Bot, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function AIAdvisor({ symbol, price, change }: { symbol: string, price: number, change: number }) {
    const [analysis, setAnalysis] = useState<string>('');
    const [sentiment, setSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate AI thinking time
        const timer = setTimeout(() => {
            generateAnalysis();
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [symbol]);

    const generateAnalysis = () => {
        // Simple rule-based generation to simulate AI
        const technicals = change > 0
            ? "showing strong bullish momentum above the 50-day moving average."
            : "facing resistance near current levels and showing bearish divergence.";

        const fundamentals = price > 2000
            ? "The company maintains solid fundamentals with a robust P/E ratio."
            : "Volatility is expected due to recent market sector corrections.";

        const risk = Math.abs(change) > 2
            ? "High volatility detected. Recommended for aggressive investors."
            : "Stable price action suggests a good entry point for long-term holding.";

        setAnalysis(`Based on real-time data, ${symbol} is ${technicals} ${fundamentals} ${risk}`);

        if (change > 1) setSentiment('bullish');
        else if (change < -1) setSentiment('bearish');
        else setSentiment('neutral');
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-6 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Bot size={100} />
            </div>

            <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-500/20 p-2 rounded-lg">
                    <Bot className="text-indigo-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-indigo-100">AI Analyst Insight</h3>
                {loading && <span className="text-xs text-indigo-300 animate-pulse">Thinking...</span>}
            </div>

            {!loading && (
                <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm uppercase tracking-wider font-bold">Sentiment:</span>
                        {sentiment === 'bullish' && (
                            <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">
                                <TrendingUp size={16} /> Bullish
                            </span>
                        )}
                        {sentiment === 'bearish' && (
                            <span className="flex items-center gap-1 text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded">
                                <TrendingDown size={16} /> Bearish
                            </span>
                        )}
                        {sentiment === 'neutral' && (
                            <span className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded">
                                <AlertTriangle size={16} /> Neutral
                            </span>
                        )}
                    </div>

                    <p className="text-indigo-200 leading-relaxed text-sm">
                        "{analysis}"
                    </p>

                    <div className="pt-4 border-t border-indigo-500/20 flex gap-4 text-xs text-indigo-300">
                        <div>
                            <span className="block font-bold text-white">RSI (14)</span>
                            {Math.floor(Math.random() * (70 - 30) + 30)}
                        </div>
                        <div>
                            <span className="block font-bold text-white">MACD</span>
                            {Math.random() > 0.5 ? 'Positive' : 'Negative'}
                        </div>
                        <div>
                            <span className="block font-bold text-white">Support</span>
                            ₹{(price * 0.95).toFixed(0)}
                        </div>
                        <div>
                            <span className="block font-bold text-white">Resistance</span>
                            ₹{(price * 1.05).toFixed(0)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
