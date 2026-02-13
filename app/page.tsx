import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 text-transparent bg-clip-text mb-6">
          Invest in Fractions.<br />Own the Future.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mb-10">
          MicroShare enables you to own expensive stocks with as little as ₹100.
          Start your financial journey today.
        </p>

        <div className="flex gap-4">
          <Link href="/dashboard">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold text-lg transition shadow-lg shadow-blue-500/25">
              Get Started
            </button>
          </Link>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-bold text-lg transition border border-slate-700">
            Learn More
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-3xl mb-4">🍰</div>
            <h3 className="text-xl font-bold mb-2">Fractional Ownership</h3>
            <p className="text-slate-400">Buy high-value stocks like MRF in small pieces tailored to your budget.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-3xl mb-4">🎓</div>
            <h3 className="text-xl font-bold mb-2">Learn by Doing</h3>
            <p className="text-slate-400">Master financial concepts with our interactive education modules.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Safe & Secure</h3>
            <p className="text-slate-400">Designed for minors with parental oversight and secure transactions.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
