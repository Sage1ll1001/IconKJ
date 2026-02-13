"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function QuizPage() {
    const { id } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
        async function fetchQuiz() {
            if (!id) return;
            try {
                const res = await fetch(`/api/education/quizzes/${id}`);
                const data = await res.json();
                setQuiz(data);
            } catch (error) {
                console.error("Failed to fetch quiz", error);
            }
        }
        fetchQuiz();
    }, [id]);

    const handleOptionSelect = (optionId: string) => {
        setSelectedOption(optionId);
    };

    const handleNext = () => {
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const selected = currentQuestion.options.find((opt: any) => opt.id === selectedOption);

        if (selected && selected.isCorrect) {
            setScore(score + 1);
        }

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
        } else {
            setShowResult(true);
            // In real app, submit score to backend here
        }
    };

    if (!quiz) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading Quiz...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            <Navbar />

            <main className="container mx-auto p-6 max-w-3xl">
                {!showResult ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-xl font-bold">{quiz.title}</h1>
                            <span className="text-slate-400 text-sm">Question {currentQuestionIndex + 1}/{quiz.questions.length}</span>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-6">{quiz.questions[currentQuestionIndex].text}</h2>
                            <div className="space-y-4">
                                {quiz.questions[currentQuestionIndex].options.map((option: any) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionSelect(option.id)}
                                        className={`w-full text-left p-4 rounded-xl border transition ${selectedOption === option.id
                                                ? 'border-blue-500 bg-blue-500/10 text-white'
                                                : 'border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300'
                                            }`}
                                    >
                                        {option.text}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!selectedOption}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition"
                        >
                            {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                        <div className="text-6xl mb-6">🎉</div>
                        <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
                        <p className="text-slate-400 mb-8">You scored</p>
                        <div className="text-6xl font-bold text-emerald-400 mb-8">
                            {score} / {quiz.questions.length}
                        </div>

                        <button
                            onClick={() => router.push('/education')}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-bold transition"
                        >
                            Back to Courses
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
