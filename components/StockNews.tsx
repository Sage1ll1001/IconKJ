"use client";

import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

export default function StockNews({ symbol }: { symbol: string }) {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            try {
                const res = await fetch(`/api/news?symbol=${symbol}`);
                const data = await res.json();
                setNews(data.items || []);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch news", error);
                setLoading(false);
            }
        }
        fetchNews();
    }, [symbol]);

    if (loading) return <div className="text-slate-500 animate-pulse">Loading latest news...</div>;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
                📰 Latest News
            </h3>
            <div className="grid gap-4">
                {news.slice(0, 3).map((item: any, i) => (
                    <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="group">
                            <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition mb-2 line-clamp-2">
                                {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 mb-2">{new Date(item.pubDate).toLocaleDateString()}</p>
                            <div className="flex items-center gap-1 text-xs text-blue-500 group-hover:translate-x-1 transition-transform">
                                Read Source <ExternalLink size={12} />
                            </div>
                        </a>
                    </div>
                ))}
                {news.length === 0 && (
                    <div className="text-slate-500 italic">No recent news found for {symbol}.</div>
                )}
            </div>
        </div>
    );
}
