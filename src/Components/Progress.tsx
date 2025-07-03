import React, { useEffect, useState } from "react";
import axios from "axios";

interface QuizResult {
  _id: string;
  category: string;
  score: number;
  total: number;
  createdAt: string;
}

export default function Progress(): React.JSX.Element {
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem("quiz-progress");
    if (cached) {
      setResults(JSON.parse(cached));
    }

    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://hackathon-backend-plp.onrender.com/api/quiz/my-results", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data);
        localStorage.setItem("quiz-progress", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to fetch quiz results", err);
      }
    };

    fetchResults();
  }, []);

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-emerald-500";
    if (percentage >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreBadge = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "bg-emerald-100 text-emerald-600 border-emerald-200";
    if (percentage >= 60) return "bg-amber-100 text-amber-600 border-amber-200";
    return "bg-rose-100 text-rose-600 border-rose-200";
  };

  // Function to format date in Kenyan time
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

  return (
    <div className="min-h-screen bg-white py-6 px-3 sm:py-10 sm:px-4">
      <div className="max-w-5xl mx-auto bg-white border border-purple-100 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-purple-700 mb-6 sm:mb-8 animate-fade-in">
          Your Progress
        </h2>

        {results.length === 0 ? (
          <div className="text-center text-gray-600 text-base sm:text-lg">
            No quiz history yet. Take your first quiz to see progress!
          </div>
        ) : (
          <div className="overflow-x-auto animate-slide-up">
            {/* Desktop Table */}
            <table className="hidden sm:table min-w-full text-sm sm:text-base border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="text-left px-3 sm:px-4 py-2 text-purple-500">Category</th>
                  <th className="text-left px-3 sm:px-4 py-2 text-purple-500">Score</th>
                  <th className="text-left px-3 sm:px-4 py-2 text-purple-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res, index) => (
                  <tr
                    key={res._id}
                    className="transition-transform duration-300 hover:scale-[1.02]"
                    style={{
                      animation: `fadeUp 0.5s ease ${index * 100}ms forwards`,
                      opacity: 0,
                    }}
                  >
                    <td className="px-3 sm:px-4 py-3 bg-purple-50 rounded-l-2xl text-purple-900 capitalize">
                      {res.category}
                    </td>
                    <td className="px-3 sm:px-4 py-3 bg-purple-50 border-l border-r border-purple-100 text-purple-900">
                      <span
                        className={`inline-block px-3 py-1 sm:px-4 sm:py-1 rounded-xl border text-sm font-semibold ${getScoreBadge(res.score, res.total)}`}
                      >
                        <span className={`font-bold ${getScoreColor(res.score, res.total)}`}>
                          {res.score}/{res.total}
                        </span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 bg-purple-50 rounded-r-2xl text-purple-700 text-sm sm:text-base">
                      {formatDate(res.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {results.map((res, index) => (
                <div
                  key={res._id}
                  className="bg-purple-50 rounded-2xl p-4 shadow-sm transition-transform duration-300 hover:scale-[1.02]"
                  style={{
                    animation: `fadeUp 0.5s ease ${index * 100}ms forwards`,
                    opacity: 0,
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-purple-900 font-medium capitalize">
                      {res.category}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-xl border text-xs font-semibold ${getScoreBadge(res.score, res.total)}`}
                    >
                      <span className={`font-bold ${getScoreColor(res.score, res.total)}`}>
                        {res.score}/{res.total}
                      </span>
                    </span>
                  </div>
                  <div className="text-purple-700 text-sm">
                    {formatDate(res.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-in-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
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