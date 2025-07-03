import  { useState, useEffect, useRef } from "react";

const interviewScenarios: Record<string, { 
  questions: {
    text: string;
    keywords: string[];
    modelAnswer: string;
  }[];
  feedback: string;
}> = {
  MERN: {
    questions: [
      {
        text: "Can you walk me through your experience with the MERN stack?",
        keywords: ["mongodb", "express", "react", "node", "experience"],
        modelAnswer: "A strong answer would mention hands-on experience with all four components, specific projects, and challenges overcome."
      },
      {
        text: "How would you handle authentication in a MERN application?",
        keywords: ["jwt", "passport", "oauth", "middleware", "security"],
        modelAnswer: "Good responses mention JWT, session management, password hashing, and security best practices."
      },
      {
        text: "What strategies would you use to optimize MongoDB queries?",
        keywords: ["indexing", "aggregation", "pipeline", "sharding", "performance"],
        modelAnswer: "Look for mentions of indexing, query optimization, aggregation pipeline, and database design."
      }
    ],
    feedback: "MERN stack developers should focus on full-stack integration, performance optimization, and state management."
  },
  Flutter: {
    questions: [
      {
        text: "What attracted you to Flutter development?",
        keywords: ["cross-platform", "widgets", "dart", "performance", "community"],
        modelAnswer: "Strong answers mention hot reload, single codebase, performance, and growing ecosystem."
      },
      {
        text: "How do you manage state in a Flutter application?",
        keywords: ["provider", "bloc", "riverpod", "setstate", "architecture"],
        modelAnswer: "Expect mentions of state management solutions like Provider, BLoC, or Riverpod with examples."
      }
    ],
    feedback: "Strong Flutter candidates demonstrate deep widget knowledge, state management expertise, and cross-platform thinking."
  },
  Dart: {
    questions: [
      {
        text: "What are the main features of Dart?",
        keywords: ["null safety", "oop", "async", "compilation", "flutter"],
        modelAnswer: "Good answers cover sound null safety, JIT/AOT compilation, async/await, and strong typing."
      },
      {
        text: "What is a mixin and how is it used in Dart?",
        keywords: ["reuse", "multiple", "inheritance", "with", "composition"],
        modelAnswer: "Should explain mixins as a way to reuse code across class hierarchies without full inheritance."
      },
      {
        text: "Explain null safety in Dart.",
        keywords: ["sound", "runtime", "compile", "optional", "variables"],
        modelAnswer: "Best answers explain sound null safety, non-nullable by default, and the ?/! operators."
      }
    ],
    feedback: "Strong Dart developers understand language fundamentals, null safety, and how Dart powers Flutter."
  },
  "AI for Software Engineering": {
    questions: [
      {
        text: "How can AI help with code reviews?",
        keywords: ["analysis", "patterns", "bugs", "suggestions", "automation"],
        modelAnswer: "Look for mentions of static analysis, pattern recognition, and automated improvement suggestions."
      },
      {
        text: "What are the limitations of current AI coding assistants?",
        keywords: ["context", "creativity", "security", "understanding", "edge"],
        modelAnswer: "Good answers recognize limitations in understanding business context and creative problem-solving."
      },
      {
        text: "How would you validate AI-generated code?",
        keywords: ["testing", "review", "security", "standards", "metrics"],
        modelAnswer: "Strong responses include unit testing, peer review, security scanning, and style checks."
      }
    ],
    feedback: "Effective AI engineers balance tool usage with critical validation and understand tool limitations."
  }
};

type Message = {
  sender: 'interviewer' | 'candidate' | 'system';
  text: string;
  timestamp: Date;
};

type AnswerQuality = {
  score: number;
  feedback: string;
  missedKeywords: string[];
  isCorrect: boolean; 
};

export default function MockInterview() {
  const [category, setCategory] = useState("MERN");
  const [step, setStep] = useState(0);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [interviewPhase, setInterviewPhase] = useState<'intro' | 'questions' | 'feedback'>('intro');
  const [showThinking, setShowThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerQuality[]>([]);
  const analyzeAnswer = (answer: string, questionIdx: number): AnswerQuality => {
    const question = interviewScenarios[category].questions[questionIdx];
    const answerLower = answer.toLowerCase();
    let matchedKeywords = 0;
    const missedKeywords: string[] = [];
    
    question.keywords.forEach(keyword => {
      if (answerLower.includes(keyword)) {
        matchedKeywords++;
      } else {
        missedKeywords.push(keyword);
      }
    });

    const score = Math.min(10, Math.floor((matchedKeywords / question.keywords.length) * 10));
    const isCorrect = score >= 6; // Consider answers with 60%+ keyword matches as correct
    
    let feedback = "";
    
    if (isCorrect) {
      if (score >= 8) {
        feedback = "✅ Excellent answer! You covered all key points perfectly.";
      } else {
        feedback = "👍 Good answer! You hit most of the key points.";
      }
      
      // Add motivational phrases for correct answers
      const motivationalPhrases = [
        "Keep up the great work!",
        "You're doing fantastic!",
        "This is interview-ready material!",
        "You clearly know your stuff!",
        "Impressive knowledge demonstrated!"
      ];
      
      feedback += ` ${motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]}`;
    } else {
      feedback = "❌ Incorrect answer. ";
      
      if (score >= 4) {
        feedback += "You're on the right track but missed some important concepts.";
      } else {
        feedback += "This needs significant improvement to meet expectations.";
      }
      
      feedback += ` Here's what was expected: ${question.modelAnswer}`;
      
      // Add constructive feedback for incorrect answers
      const constructivePhrases = [
        "Don't worry - practice makes perfect!",
        "Review the key concepts and try again!",
        "You'll get this with a bit more study!",
        "This is a learning opportunity - you got this!",
        "Every expert was once a beginner - keep going!"
      ];
      
      feedback += ` ${constructivePhrases[Math.floor(Math.random() * constructivePhrases.length)]}`;
    }

    if (missedKeywords.length > 0 && !isCorrect) {
      feedback += `\n\n🔍 Focus on these terms: ${missedKeywords.join(', ')}.`;
    }

    return { score, feedback, missedKeywords, isCorrect };
  };

  
 
  // Initialize conversation
  useEffect(() => {
    setConversation([{
      sender: 'interviewer',
      text: `Hello! Welcome to your ${category} mock interview. I'll be asking you ${interviewScenarios[category].questions.length} questions. Ready to begin?`,
      timestamp: new Date()
    }]);
    setInterviewPhase('intro');
    setStep(0);
    setScores([]);
    setAnswerFeedback([]);
  }, [category]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const simulateTyping = (message: string, callback: () => void) => {
    setIsTyping(true);
    let typedMessage = '';
    let i = 0;
    
    const typingInterval = setInterval(() => {
      if (i < message.length) {
        typedMessage += message.charAt(i);
        setConversation(prev => [
          ...prev.slice(0, -1),
          { ...prev[prev.length - 1], text: typedMessage }
        ]);
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        callback();
      }
    }, 20);
  };

  const handleStartInterview = () => {
    setInterviewPhase('questions');
    setConversation(prev => [...prev, {
      sender: 'interviewer',
      text: "",
      timestamp: new Date()
    }]);
    
    // Simulate typing for the first message
    simulateTyping("Great! Let's start with our first question:", () => {
      // Add first question with typing effect
      setConversation(prev => [...prev, {
        sender: 'interviewer',
        text: "",
        timestamp: new Date()
      }]);
      simulateTyping(interviewScenarios[category].questions[0].text, () => {
        setStep(0);
      });
    });
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) return;

    // Analyze answer
    const quality = analyzeAnswer(currentAnswer, step);
    setScores([...scores, quality.score]);
    setAnswerFeedback([...answerFeedback, quality]);
   
    // Add candidate answer with quality indicator
    const newMessages: Message[] = [{
      sender: 'candidate',
      text: currentAnswer,
      timestamp: new Date()
    }];

    // Add visual distinction for correct/incorrect answers
    if (quality.isCorrect) {
      newMessages.push({
        sender: 'system',
        text: `💡 ${quality.feedback}`,
        timestamp: new Date()
      });
    } else {
      newMessages.push({
        sender: 'system',
        text: `⚠️ ${quality.feedback}`,
        timestamp: new Date()
      });
    }

    setConversation(prev => [...prev, ...newMessages]);
    setCurrentAnswer("");

    // Add candidate answer with quality indicator
    setConversation(prev => [...prev, {
      sender: 'candidate',
      text: currentAnswer,
      timestamp: new Date()
    }, {
      sender: 'system',
      text: `💡 Feedback: ${quality.feedback}`,
      timestamp: new Date()
    }]);
 
    setCurrentAnswer("");

    // Show thinking indicator
    setShowThinking(true);

    // Simulate interviewer response after delay
    setTimeout(() => {
      setShowThinking(false);
      
      if (step < interviewScenarios[category].questions.length - 1) {
        // Move to next question
        const nextStep = step + 1;
        setStep(nextStep);
        setConversation(prev => [...prev, {
          sender: 'interviewer',
          text: "",
          timestamp: new Date()
        }]);
        
        simulateTyping(interviewScenarios[category].questions[nextStep].text, () => {});
      } else {
        // Interview complete
        setInterviewPhase('feedback');
        generateFinalFeedback();
      }
    }, 2000);
  };

const generateFinalFeedback = () => {
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    let overallFeedback = "";
    const correctAnswers = answerFeedback.filter(f => f.isCorrect).length;
    const totalQuestions = interviewScenarios[category].questions.length;
    
    if (averageScore >= 8) {
      overallFeedback = `🎉 Outstanding performance! You got ${correctAnswers}/${totalQuestions} questions correct. `;
      overallFeedback += "You're ready to ace real interviews!";
    } else if (averageScore >= 6) {
      overallFeedback = `👍 Good job! You got ${correctAnswers}/${totalQuestions} questions correct. `;
      overallFeedback += "With a bit more practice, you'll be interview-ready!";
    } else {
      overallFeedback = `📚 You got ${correctAnswers}/${totalQuestions} questions correct. `;
      overallFeedback += "Don't get discouraged - focus on the areas below and try again!";
    }

    overallFeedback += ` Your average score was ${averageScore.toFixed(1)}/10.`;
    
    // Add areas for improvement
    const allMissed = answerFeedback.flatMap(f => f.missedKeywords);
    const uniqueMissed = [...new Set(allMissed)];
    
    if (uniqueMissed.length > 0) {
      overallFeedback += `\n\n🔧 Key areas to improve: ${uniqueMissed.join(', ')}.`;
    }

    // Add final motivational note
    overallFeedback += `\n\n💪 ${
      averageScore >= 8 ? "You're crushing it! Keep up the amazing work!" :
      averageScore >= 6 ? "You're making great progress! Keep practicing!" :
      "Every expert was once a beginner. Keep going and you'll get there!"
    }`;

    setConversation(prev => [...prev, {
      sender: 'interviewer',
      text: "",
      timestamp: new Date()
    }]);
    
    simulateTyping("Interview complete! Here's your overall feedback...", () => {
      setConversation(prev => [...prev, {
        sender: 'system',
        text: overallFeedback,
        timestamp: new Date()
      }, {
        sender: 'system',
        text: interviewScenarios[category].feedback,
        timestamp: new Date()
      }]);
    });
  };
  const handleRestart = () => {
    setStep(0);
    setInterviewPhase('intro');
    setScores([]);
    setAnswerFeedback([]);
    setConversation([{
      sender: 'interviewer',
      text: `Let's start another ${category} mock interview. I'll be asking you ${interviewScenarios[category].questions.length} questions. Ready to begin?`,
      timestamp: new Date()
    }]);
  };

  const getProgressPercentage = () => {
    if (interviewPhase === 'intro') return 0;
    if (interviewPhase === 'feedback') return 100;
    return ((step + 1) / interviewScenarios[category].questions.length) * 100;
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const renderMessage = (msg: Message, i: number) => {
    if (msg.sender === 'system') {
      return (
        <div key={i} className="flex justify-center">
          <div className="bg-yellow-900/60 border border-yellow-700 rounded-2xl p-4 max-w-[90%]">
            <div className="flex items-center gap-2 text-yellow-300 mb-1">
              <span className="font-bold">Feedback</span>
              <span className="text-xs text-white/50">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <p className="text-white whitespace-pre-wrap">{msg.text}</p>
          </div>
        </div>
      );
    }
    
    return (
      <div 
        key={i} 
        className={`flex ${msg.sender === 'interviewer' ? 'justify-start' : 'justify-end'}`}
      >
        <div 
          className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'interviewer' ? 
            'bg-purple-900/60 border border-purple-700' : 
            'bg-blue-900/60 border border-blue-700'}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-bold ${msg.sender === 'interviewer' ? 'text-purple-300' : 'text-blue-300'}`}>
              {msg.sender === 'interviewer' ? 'Interviewer' : 'You'}
            </span>
            <span className="text-xs text-white/50">
              {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
          <p className="text-white whitespace-pre-wrap">{msg.text}</p>
        </div>
      </div>
    );
  };

  // Calculate average score
  const averageScore = scores.length > 0 
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎤 Technical Interview Simulator
          </h1>
          <p className="text-purple-200 text-lg">
            Practice real-world interview scenarios with AI feedback
          </p>
        </div>

        {/* Interview Container */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Interview Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {interviewPhase === 'intro' ? '👋 Interview Setup' : 
                 interviewPhase === 'questions' ? '💬 Live Interview' : '📝 Feedback'}
              </h2>
              
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                disabled={interviewPhase !== 'intro'}
              >
                {Object.keys(interviewScenarios).map((cat) => (
                  <option key={cat} value={cat} className="text-purple-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-white/90 text-sm">
                <span>
                  {interviewPhase === 'intro' ? 'Not started' : 
                   interviewPhase === 'feedback' ? 'Completed' : 
                   `Question ${step + 1} of ${interviewScenarios[category].questions.length}`}
                </span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white to-purple-200 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Interview Content */}
          <div className="p-4 md:p-6">
            {/* Conversation Window */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-700 h-96 overflow-y-auto p-4 mb-6">
              <div className="space-y-4">
                {conversation.map((msg, i) => renderMessage(msg, i))}
                
                {showThinking && (
                  <div className="flex justify-start">
                    <div className="bg-purple-900/60 border border-purple-700 rounded-2xl p-4 max-w-[80%]">
                      <div className="flex items-center gap-2 text-purple-300">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                        <span>Interviewer is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Interaction Area */}
            {interviewPhase === 'intro' ? (
              <div className="text-center">
                <button
                  onClick={handleStartInterview}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  🚀 Start Interview
                </button>
              </div>
            ) : interviewPhase === 'questions' ? (
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    rows={4}
                    className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    disabled={isTyping}
                  />
                  <div className="absolute bottom-3 right-3 bg-black/30 rounded-lg px-2 py-1 text-xs text-white/70">
                    {getWordCount(currentAnswer)} words
                  </div>
                </div>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswer.trim() || isTyping}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === interviewScenarios[category].questions.length - 1 ? 
                    "Submit Final Answer" : "Submit Answer"}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Interview Complete!</h3>
                  <p className="text-green-200">
                    You answered all {interviewScenarios[category].questions.length} questions.
                  </p>
                </div>
                <button
                  onClick={handleRestart}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  🔄 Start New Interview
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div className="text-xl mb-1">📋</div>
            <div className="text-white font-medium text-sm">{category}</div>
            <div className="text-purple-200 text-xs">Topic</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div className="text-xl mb-1">⭐</div>
            <div className="text-white font-medium text-sm">{averageScore}/10</div>
            <div className="text-purple-200 text-xs">Avg Score</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div className="text-xl mb-1">💬</div>
            <div className="text-white font-medium text-sm">
              {conversation.filter(m => m.sender === 'candidate').length}
            </div>
            <div className="text-purple-200 text-xs">Answers</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div className="text-xl mb-1">⏱️</div>
            <div className="text-white font-medium text-sm">
              {Math.floor(conversation.length * 0.5)} min
            </div>
            <div className="text-purple-200 text-xs">Duration</div>
          </div>
        </div>
      </div>
    </div>
  );
}