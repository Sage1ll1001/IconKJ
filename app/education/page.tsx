"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function EducationDashboard() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                const res = await fetch('/api/education/quizzes');
                const data = await res.json();
                setQuizzes(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch quizzes", error);
                setLoading(false);
            }
        }
        fetchQuizzes();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            <Navbar />

            <main className="container mx-auto p-6 space-y-8">
                <div className="text-center py-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text mb-4">
                        Learn & Earn
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Master the stock market with our interactive modules.
                        Levels up your profile and unlock new investment limits.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-slate-500">Loading modules...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map((quiz: any) => (
                            <div key={quiz.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500 transition group p-8">
                                <div className="text-4xl mb-4 bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-blue-600/20 transition">
                                    📚
                                </div>
                                <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                                <p className="text-slate-400 text-sm mb-6 min-h-[40px]">{quiz.description}</p>

                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                                        {quiz.category}
                                    </span>
                                    <Link href={`/education/quiz/${quiz.id}`}>
                                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition text-sm">
                                            Start Quiz
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
