import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/apiService';
import { QuizQuestion } from '../types';
import { BrainCircuit, Check, X, Trophy, RefreshCw, ArrowRight } from 'lucide-react';

export const Quiz: React.FC = () => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    useEffect(() => {
        loadQuiz();
    }, []);

    const loadQuiz = async () => {
        setLoading(true);
        setShowScore(false);
        setScore(0);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        try {
            const data = await generateQuiz();
            setQuestions(data);
        } catch (error) {
            console.error("Failed to load quiz", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerClick = (index: number) => {
        if (isAnswered) return;
        setSelectedAnswer(index);
        setIsAnswered(true);

        if (index === questions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestionIndex(nextQuestion);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowScore(true);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4 animate-fade-in">
                <RefreshCw size={48} className="text-primary-DEFAULT animate-spin" />
                <p className="text-text-muted text-lg">Generating NIRD Challenge...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center space-y-4 animate-fade-in">
                <p className="text-text-muted">Failed to load questions.</p>
                <button
                    onClick={loadQuiz}
                    className="bg-primary-DEFAULT text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (showScore) {
        const percentage = (score / questions.length) * 100;
        let title = "Digital Novice";
        let message = "Keep learning! The resistance needs you!";
        let color = "text-red-400";
        let bgColor = "bg-red-500/10";

        if (percentage === 100) {
            title = "NIRD Master 🏆";
            message = "Perfect! You are a true guardian of the digital world!";
            color = "text-green-400";
            bgColor = "bg-green-500/10";
        } else if (percentage >= 60) {
            title = "Open Source Jedi ⚔️";
            message = "Great job! You know your way around the terminal.";
            color = "text-blue-400";
            bgColor = "bg-blue-500/10";
        }

        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-slide-up pb-12">
                <div className="bg-surface p-8 rounded-2xl border border-white/5 shadow-xl text-center relative overflow-hidden">
                    {percentage === 100 && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                            <div className="absolute top-10 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                            <div className="absolute bottom-10 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                        </div>
                    )}

                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${bgColor} ${color} mb-6 relative`}>
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="opacity-20" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"
                                strokeDasharray={`${percentage * 2.83} 283`}
                                className="transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-bold">{score}/{questions.length}</span>
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold text-text-main mb-2">{title}</h2>
                    <p className="text-text-muted text-lg mb-8">{message}</p>

                    <button
                        onClick={loadQuiz}
                        className="bg-primary-DEFAULT hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <RefreshCw size={20} /> Play Again
                    </button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-text-main px-2">Review Your Answers</h3>
                    {questions.map((q, i) => (
                        <div key={i} className="bg-surface p-6 rounded-xl border border-white/5">
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    {/* We don't track user answers in this simple state, but we can show the correct one. 
                                        To be fully interactive, we'd need to store user answers. 
                                        For now, let's just show the question and the correct answer. 
                                    */}
                                    <div className="w-8 h-8 rounded-full bg-surfaceHighlight flex items-center justify-center text-text-muted font-bold text-sm">
                                        {i + 1}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-text-main mb-3">{q.question}</p>
                                    <div className="space-y-2">
                                        {q.options.map((opt, optIndex) => (
                                            <div key={optIndex} className={`p-3 rounded-lg text-sm flex items-center justify-between ${optIndex === q.correctAnswer
                                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                    : "bg-surfaceHighlight text-text-muted opacity-50"
                                                }`}>
                                                <span>{opt}</span>
                                                {optIndex === q.correctAnswer && <Check size={16} />}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-3 text-sm text-text-muted italic border-l-2 border-primary-DEFAULT pl-3">
                                        {q.explanation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-surfaceHighlight rounded-lg border border-white/5">
                        <BrainCircuit size={24} className="text-primary-DEFAULT" />
                    </div>
                    <h2 className="text-xl font-bold text-text-main">NIRD Challenge</h2>
                </div>
                <div className="text-text-muted font-medium">
                    Question {currentQuestionIndex + 1}/{questions.length}
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-surface p-8 rounded-2xl border border-white/5 shadow-xl">
                <h3 className="text-2xl font-bold text-text-main mb-8 leading-relaxed">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => {
                        let buttonStyle = "bg-surfaceHighlight border-white/5 hover:border-primary-DEFAULT/50";
                        let icon = null;

                        if (isAnswered) {
                            if (index === currentQuestion.correctAnswer) {
                                buttonStyle = "bg-green-500/10 border-green-500/50 text-green-400";
                                icon = <Check size={20} />;
                            } else if (index === selectedAnswer) {
                                buttonStyle = "bg-red-500/10 border-red-500/50 text-red-400";
                                icon = <X size={20} />;
                            } else {
                                buttonStyle = "opacity-50";
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerClick(index)}
                                disabled={isAnswered}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${buttonStyle}`}
                            >
                                <span className={`font-medium ${!isAnswered && 'group-hover:text-primary-DEFAULT transition-colors'}`}>
                                    {option}
                                </span>
                                {icon}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-8 pt-6 border-t border-white/10 animate-fade-in">
                        <div className="bg-primary-DEFAULT/10 p-4 rounded-xl border border-primary-DEFAULT/20 mb-6">
                            <p className="text-text-main">
                                <span className="font-bold text-primary-DEFAULT">Explanation: </span>
                                {currentQuestion.explanation}
                            </p>
                        </div>
                        <button
                            onClick={handleNextQuestion}
                            className="w-full bg-primary-DEFAULT hover:bg-primary-hover text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {currentQuestionIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"} <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
