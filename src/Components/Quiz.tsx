import { useState, useEffect } from "react";
import axios from "axios";

const quizData: Record<string, { question: string; options: string[]; answer: string }[]> = {
  MERN: [
    {
      question: "What does MERN stand for?",
      options: ["MongoDB, Express, React, Node", "MySQL, Express, Redux, Node", "Mongo, Ember, React, Next"],
      answer: "MongoDB, Express, React, Node",
    },
    {
      question: "Which one is used to build UI in MERN?",
      options: ["Node", "React", "Express"],
      answer: "React",
    },
    {
      question: "Which database does MERN use?",
      options: ["MySQL", "MongoDB", "Firebase"],
      answer: "MongoDB",
    },
    {
      question: "What is Express.js used for?",
      options: ["Database management", "Server-side framework", "UI rendering"],
      answer: "Server-side framework",
    },
    {
      question: "Which runtime is used in MERN for backend development?",
      options: ["Python", "Node.js", "PHP"],
      answer: "Node.js",
    },
    {
      question: "Which one is a NoSQL database?",
      options: ["MongoDB", "PostgreSQL", "MySQL"],
      answer: "MongoDB",
    },
  ],
  Flutter: [
    {
      question: "Which language does Flutter use?",
      options: ["Java", "Kotlin", "Dart"],
      answer: "Dart",
    },
    {
      question: "What is Flutter used for?",
      options: ["Web scraping", "Mobile app development", "Database creation"],
      answer: "Mobile app development",
    },
    {
      question: "What is a Widget in Flutter?",
      options: ["A database", "A function", "A UI element"],
      answer: "A UI element",
    },
    {
      question: "Who developed Flutter?",
      options: ["Microsoft", "Facebook", "Google"],
      answer: "Google",
    },
    {
      question: "Flutter supports which platforms?",
      options: ["Only Android", "Android and iOS", "Desktop only"],
      answer: "Android and iOS",
    },
    {
      question: "What is the command to create a new Flutter project?",
      options: ["flutter start", "flutter create", "flutter init"],
      answer: "flutter create",
    },
  ],
  Dart: [
    {
      question: "Who developed Dart?",
      options: ["Facebook", "Google", "Microsoft"],
      answer: "Google",
    },
    {
      question: "Dart is mainly used in?",
      options: ["Machine Learning", "Web Development", "Flutter"],
      answer: "Flutter",
    },
    {
      question: "Dart is a _ language?",
      options: ["Compiled", "Interpreted", "Dynamic"],
      answer: "Compiled",
    },
    {
      question: "What type of programming language is Dart?",
      options: ["Procedural", "Object-oriented", "Functional"],
      answer: "Object-oriented",
    },
    {
      question: "Which file extension is used for Dart files?",
      options: [".dart", ".d", ".dt"],
      answer: ".dart",
    },
    {
      question: "How do you define a function in Dart?",
      options: ["function name(){}", "def name(){}", "void name(){}"],
      answer: "void name(){}",
    },
  ],
  "AI for Software Development": [
    {
      question: "Which AI tool helps generate code?",
      options: ["ChatGPT", "Photoshop", "Excel"],
      answer: "ChatGPT",
    },
    {
      question: "Cursor and Windsurf are examples of?",
      options: ["Databases", "AI dev tools", "OS"],
      answer: "AI dev tools",
    },
    {
      question: "GitHub Copilot is built by?",
      options: ["Facebook", "OpenAI", "Google"],
      answer: "OpenAI",
    },
    {
      question: "Which AI tool is integrated into VS Code for suggestions?",
      options: ["Copilot", "DALL·E", "Stable Diffusion"],
      answer: "Copilot",
    },
    {
      question: "Which AI model is used by ChatGPT?",
      options: ["BERT", "GPT", "ResNet"],
      answer: "GPT",
    },
    {
      question: "Which company created GPT models?",
      options: ["OpenAI", "Meta", "Amazon"],
      answer: "OpenAI",
    },
  ],
  "Software Testing": [
    {
      question: "Which is a type of software testing?",
      options: ["UI Testing", "UX Writing", "Database Migration"],
      answer: "UI Testing",
    },
    {
      question: "Which tool is used for unit testing in JS?",
      options: ["Postman", "Jest", "Photoshop"],
      answer: "Jest",
    },
    {
      question: "Selenium is used for?",
      options: ["Frontend", "Backend", "Automation Testing"],
      answer: "Automation Testing",
    },
    {
      question: "Which is a manual testing technique?",
      options: ["Black-box testing", "Jenkins", "Docker"],
      answer: "Black-box testing",
    },
    {
      question: "What does CI/CD stand for in testing?",
      options: ["Continuous Integration / Continuous Delivery", "Code Inspection / Code Debugging", "Customer Interface / Code Delivery"],
      answer: "Continuous Integration / Continuous Delivery",
    },
    {
      question: "What is the goal of regression testing?",
      options: ["Test performance", "Test new features", "Ensure old features still work"],
      answer: "Ensure old features still work",
    },
  ],
};



type QuestionResult = {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  feedback: string;
};
export default function Quiz() {
  const [category, setCategory] = useState("MERN");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 3;

  useEffect(() => {
    const redoCategory = localStorage.getItem("quizRedoCategory");
    if (redoCategory) {
      setCategory(redoCategory);
      localStorage.removeItem("quizRedoCategory");
    }
  }, []);

  const handleChange = (qIndex: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const questions = quizData[category];
    let correct = 0;

    
    // Create results for each question
    const results = questions.map((q, i) => {
      const isCorrect = answers[i] === q.answer;
      if (isCorrect) correct++;
      
      return {
        question: q.question,
        userAnswer: answers[i] || "Not answered",
        correctAnswer: q.answer,
        isCorrect,
        feedback: isCorrect 
          ? getRandomPositiveFeedback() 
          : getCorrectiveFeedback(q.answer)
      };
    });
    
    setQuestionResults(results);
    setScore(correct);
    setSubmitted(true);

    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://hackathon-backend-plp.onrender.com/api/quiz/submit",
        {
          category,
          score: correct,
          total: questions.length,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error submitting result", err);
    } finally {
      setIsLoading(false);
    }
  };
  const getRandomPositiveFeedback = () => {
    const positiveFeedback = [
      "Great job! You nailed this one!",
      "Perfect answer! You clearly understand this concept.",
      "Excellent! Your knowledge shines here.",
      "Spot on! You've mastered this topic.",
      "Correct! You're doing amazing!"
    ];
    return positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)];
  };

  const getCorrectiveFeedback = (correctAnswer: string) => {
    const correctiveFeedback = [
      `Almost there! The correct answer is "${correctAnswer}". Keep practicing!`,
      `Not quite right. Remember: "${correctAnswer}". You'll get it next time!`,
      `Good attempt! The right answer was "${correctAnswer}". Review this concept.`,
      `Don't worry! The correct answer is "${correctAnswer}". Practice makes perfect!`,
      `Close! The answer we were looking for is "${correctAnswer}". Keep learning!`
    ];
    return correctiveFeedback[Math.floor(Math.random() * correctiveFeedback.length)];
  };

  const getScoreColor = () => {
    const percentage = (score / quizData[category].length) * 100;
    if (percentage === 100) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-500";
  };

   // Get current questions for pagination
  const getCurrentQuestions = () => {
    const startIndex = currentPage * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return quizData[category].slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(quizData[category].length / questionsPerPage);

   return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 py-6 px-3 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header - Made more compact for mobile */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            ⚡ AI Quiz Challenge
          </h1>
          <p className="text-purple-200 text-sm sm:text-lg">
            Test your knowledge and enhance your skills
          </p>
        </div>

        {/* Quiz Container - Adjusted padding for mobile */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 overflow-hidden">
          {/* Category Selector - Stacked on mobile */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                📚 Choose Topic
              </h2>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setAnswers({});
                  setSubmitted(false);
                  setCurrentPage(0);
                }}
                className="px-3 py-2 sm:px-4 sm:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
              >
                {Object.keys(quizData).map((cat) => (
                  <option key={cat} value={cat} className="text-purple-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions - Adjusted spacing and sizing */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="space-y-4 sm:space-y-6">
              {getCurrentQuestions().map((q, i) => {
                const questionIndex = currentPage * questionsPerPage + i;
                return (
                  <div
                    key={questionIndex}
                    className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {questionIndex + 1}
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                        {q.question}
                      </h3>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3 ml-9 sm:ml-12">
                      {q.options.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                            answers[questionIndex] === opt
                              ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-400 shadow-md sm:shadow-lg"
                              : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${questionIndex}`}
                            value={opt}
                            checked={answers[questionIndex] === opt}
                            onChange={() => handleChange(questionIndex, opt)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 bg-transparent border-2 border-white/50 focus:ring-purple-500 focus:ring-2"
                          />
                          <span className="text-white text-sm sm:text-base flex-1">{opt}</span>
                          {answers[questionIndex] === opt && (
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls - Adjusted for mobile */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base"
              >
                ← Previous
              </button>
              
              <div className="text-white font-medium text-sm sm:text-base">
                Page {currentPage + 1} of {totalPages}
              </div>
              
              <button
                onClick={() => {
                  if (currentPage < totalPages - 1) {
                    setCurrentPage(prev => prev + 1);
                  } else {
                    handleSubmit();
                  }
                }}
                disabled={isLoading}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg sm:rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base"
              >
                {currentPage < totalPages - 1 ? 'Next →' : 'Submit Quiz'}
              </button>
            </div>

            {/* Submit Button - Made more compact for mobile */}
            <div className="flex justify-center mt-6 sm:mt-8">
              <button
                onClick={handleSubmit}
                disabled={isLoading || Object.keys(answers).length < quizData[category].length}
                className="relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[160px] sm:min-w-[200px]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">Submitting...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-1 sm:gap-2">
                    <span className="text-sm sm:text-base">🚀</span>
                    <span>Submit Quiz</span>
                  </span>
                )}
              </button>
            </div>

            {/* Results - Adjusted for mobile */}
            {submitted && (
              <div className="mt-6 sm:mt-8 animate-fadeIn">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20">
                  {/* Score Display */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3 sm:mb-4">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        {score}/{quizData[category].length}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                      Your Score: {score} out of {quizData[category].length}
                    </h3>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 rounded-full h-2 sm:h-3 mb-3 sm:mb-4 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${(score / quizData[category].length) * 100}%` }}
                      ></div>
                    </div>
                    
                    <p className={`text-lg sm:text-xl font-semibold ${getScoreColor()}`}>
                      {Math.round((score / quizData[category].length) * 100)}% Accuracy
                    </p>
                  </div>

                  {/* Detailed Marking Sheet - Adjusted for mobile */}
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                      📝 Question Breakdown
                    </h3>
          
                    <div className="space-y-3 sm:space-y-4">
                      {questionResults.map((result, i) => (
                        <div 
                          key={i}
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${
                            result.isCorrect 
                              ? "bg-green-900/20 border-green-500/50" 
                              : "bg-red-900/20 border-red-500/50"
                          }`}
                        >
                          <div className="flex items-start gap-2 sm:gap-3 mb-1 sm:mb-2">
                            <div className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${
                              result.isCorrect ? "bg-green-500" : "bg-red-500"
                            }`}>
                              {result.isCorrect ? "✓" : "✗"}
                            </div>
                            <h4 className="text-white font-medium text-sm sm:text-base">{result.question}</h4>
                          </div>
                          
                          <div className="ml-7 sm:ml-9 space-y-1 sm:space-y-2">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span className="text-white/70 text-xs sm:text-sm">Your answer:</span>
                              <span className={`font-medium text-xs sm:text-sm ${
                                result.isCorrect ? "text-green-300" : "text-red-300"
                              }`}>
                                {result.userAnswer}
                              </span>
                            </div>
                            
                            {!result.isCorrect && (
                              <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-white/70 text-xs sm:text-sm">Correct answer:</span>
                                <span className="text-green-300 font-medium text-xs sm:text-sm">
                                  {result.correctAnswer}
                                </span>
                              </div>
                            )}
                            
                            <div className="text-xs sm:text-sm mt-1 sm:mt-2 italic text-white/80">
                              {result.feedback}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Feedback - Adjusted for mobile */}
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-400/30 mb-4 sm:mb-6">
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                      💡 Feedback
                    </h4>
                    <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                      {score === quizData[category].length ? (
                        <>🔥 Perfect score! You nailed it. You're a {category} pro!</>
                      ) : score >= quizData[category].length - 1 ? (
                        <>👏 So close! A bit more practice and you're golden.</>
                      ) : score >= Math.floor(quizData[category].length / 2) ? (
                        <>👍 Nice! You're getting the hang of {category}. Keep practicing.</>
                      ) : (
                        <>💪 Don't give up! Every expert was once a beginner. Try again!</>
                      )}
                    </p>
                  </div>

                  {/* Retake Button - Adjusted for mobile */}
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setAnswers({});
                        setScore(0);
                      }}
                      className="px-4 py-2 sm:px-6 sm:py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                    >
                      🔄 Retake Quiz
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Footer - Adjusted for mobile */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
          {[
            { label: "Questions", value: quizData[category].length, icon: "❓" },
            { label: "Category", value: category, icon: "📂" },
            { label: "Difficulty", value: "Intermediate", icon: "⭐" },
            { label: "Time", value: "5 min", icon: "⏱️" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/20"
            >
              <div className="text-xl sm:text-2xl mb-1">{stat.icon}</div>
              <div className="text-white font-semibold text-xs sm:text-sm truncate">{stat.value}</div>
              <div className="text-purple-200 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
