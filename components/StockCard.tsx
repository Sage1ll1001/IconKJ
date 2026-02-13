import Link from 'next/link';

interface StockProps {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
}

export default function StockCard({ stock }: { stock: StockProps }) {
    const isPositive = stock.change >= 0;

    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
                    <p className="text-slate-400 text-sm">{stock.name}</p>
                </div>
                <div className={`text-right ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    <p className="font-mono font-bold">₹{stock.price.toLocaleString()}</p>
                    <p className="text-sm">{isPositive ? '+' : ''}{stock.change}%</p>
                </div>
            </div>
            <Link href={`/market/${stock.id}`}>
                <button className="w-full bg-slate-700 hover:bg-blue-600 text-white py-2 rounded-lg transition text-sm font-medium">
                    View Details
                </button>
            </Link>
        </div>
    );
}
