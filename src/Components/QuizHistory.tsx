import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface QuizResult {
  _id: string;
  category: string;
  score: number;
  total: number;
  createdAt: string;
}

export default function QuizHistory(): React.JSX.Element {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const token = localStorage?.getItem("token");
        const response = await fetch("https://hackathon-backend-plp.onrender.com/api/quiz/my-results", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch quiz results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleRedo = (category: string) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("quizRedoCategory", category);
    }
    navigate("/quiz");
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-emerald-400";
    if (percentage >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getScoreBadge = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (percentage >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      javascript: "JS",
      react: "⚛️",
      typescript: "TS",
      css: "🎨",
      html: "🏷️",
      node: "🟢",
      python: "🐍",
      default: category.charAt(0).toUpperCase()
    };
    return icons[category.toLowerCase()] || icons.default;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 animate-pulse">
            <div className="h-8 bg-white/10 rounded-lg w-64 mb-8"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-white/5 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%223%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mb-4 sm:mb-6 shadow-2xl shadow-purple-500/25">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            Quiz History
          </h1>
          <p className="text-lg sm:text-xl text-purple-200/80 max-w-2xl mx-auto">
            Track your learning journey and celebrate your achievements
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full flex items-center justify-center border border-white/10">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Start Learning?</h3>
              <p className="text-purple-200/70 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Your quiz history will appear here once you start taking quizzes. Begin your learning journey today!
              </p>
              <button
                onClick={() => navigate("/quiz")}
                className="group relative inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Your First Quiz
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Stats Cards - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{results.length}</p>
                    <p className="text-xs sm:text-sm text-purple-200/70">Total Quizzes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {results.length > 0 ? Math.round(results.reduce((acc, r) => acc + (r.score / r.total), 0) / results.length * 100) : 0}%
                    </p>
                    <p className="text-xs sm:text-sm text-purple-200/70">Average Score</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{new Set(results.map(r => r.category)).size}</p>
                    <p className="text-xs sm:text-sm text-purple-200/70">Categories</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Results - Responsive layout */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Recent Activity
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {results.map((result, index) => (
                    <div
                      key={result._id}
                      className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
                      style={{
                        animation: `slideUp 0.6s ease-out ${index * 100}ms both`
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 rounded-2xl flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">
                            {getCategoryIcon(result.category)}
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-white capitalize mb-1">
                              {result.category}
                            </h3>
                            <p className="text-purple-200/60 text-xs sm:text-sm">
                              {formatDate(result.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                          <div className="text-center">
                            <div className={`inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-xl border ${getScoreBadge(result.score, result.total)} backdrop-blur-sm`}>
                              <span className={`text-base sm:text-lg font-bold ${getScoreColor(result.score, result.total)}`}>
                                {result.score}/{result.total}
                              </span>
                              <span className="ml-2 text-xs sm:text-sm opacity-80">
                                ({Math.round((result.score / result.total) * 100)}%)
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRedo(result.category)}
                            className="group/btn relative inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover/btn:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Retake
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}