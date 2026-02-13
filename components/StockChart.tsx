"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function StockChart({ symbol, basePrice }: { symbol: string, basePrice: number }) {
    const [data, setData] = useState<any[]>([]);
    const [range, setRange] = useState('1D');
    const [color, setColor] = useState('#10b981'); // Default Emerald (Green)

    useEffect(() => {
        // Generate mock history based on range
        const points = range === '1D' ? 50 : range === '5D' ? 100 : 200;
        const volatility = range === '1D' ? 0.002 : 0.01;

        let currentPrice = basePrice;
        const initialData = [];

        // Create a trend based on range to make it look realistic
        const trend = (Math.random() - 0.5) * 0.001;

        for (let i = 0; i < points; i++) {
            const change = (Math.random() - 0.5) * (basePrice * volatility) + (trend * basePrice);
            currentPrice += change;
            initialData.push({
                time: i,
                price: Math.max(0.1, currentPrice)
            });
        }

        setData(initialData);

        // Determine color based on start vs end
        if (initialData.length > 0) {
            const start = initialData[0].price;
            const end = initialData[initialData.length - 1].price;
            setColor(end >= start ? '#10b981' : '#ef4444');
        }

    }, [basePrice, range]);

    return (
        <div className="w-full">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                <div className="flex gap-4 text-sm font-medium text-slate-400">
                    {['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`hover:text-blue-400 transition relative py-1 ${range === r ? 'text-blue-400' : ''}`}
                        >
                            {r}
                            {range === r && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 rounded-full"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Area */}
            <div className="h-80 w-full relative group">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" hide />
                        <YAxis
                            domain={['auto', 'auto']}
                            hide
                            scale="linear"
                            padding={{ top: 20, bottom: 20 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                            formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Price']}
                            labelStyle={{ display: 'none' }}
                            cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                {/* Crosshair Line (Simulated visual cue) */}
                <div className="absolute top-0 bottom-0 left-0 w-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                    <div className="h-full w-[1px] bg-slate-700/50"></div>
                </div>
            </div>
        </div>
    );
}
