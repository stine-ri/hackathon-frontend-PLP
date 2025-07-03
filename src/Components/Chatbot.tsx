import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bot, 
  ArrowLeft, 
  Sparkles, 
  MessageCircle, 
  Maximize2, 
  Minimize2,
  Home,
  Target,
  Brain,
  Users,
  Zap,
  BookOpen,
  TrendingUp,
  Menu,
  X
} from "lucide-react";

const ChatBot: React.FC = () => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

// Update the greeting effect to use Kenyan time
// Update the greeting effect to use Kenyan time
useEffect(() => {
  const getKenyanGreeting = () => {
    try {
      // Get current time in Kenyan timezone (UTC+3)
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: 'Africa/Nairobi',
        hour: 'numeric',
        hour12: false // Use 24-hour format for easier comparison
      };
      
      // Format just the hour in Kenyan timezone
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const kenyanHour = parseInt(formatter.format(new Date()), 10);
      
      // Determine greeting based on Kenyan time
      if (kenyanHour >= 5 && kenyanHour < 12) return "Good morning";
      if (kenyanHour >= 12 && kenyanHour < 18) return "Good afternoon";
      return "Good evening";
    } catch (error) {
      console.error("Error getting Kenyan time:", error);
      // Fallback to local time if Kenyan timezone fails
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
    }
  };

  setGreeting(getKenyanGreeting());

  // Update greeting every hour to stay current
  const interval = setInterval(() => {
    setGreeting(getKenyanGreeting());
  }, 3600000); // 1 hour in milliseconds

  return () => clearInterval(interval);
}, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const quickStartQuestions = [
    {
      icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" />,
      question: "Help me set a learning goal",
      category: "Goal Setting"
    },
    {
      icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />,
      question: "What skills should I learn for my career?",
      category: "Career Advice"
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
      question: "Create a study plan for me",
      category: "Study Planning"
    },
    {
      icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />,
      question: "How can I track my progress effectively?",
      category: "Progress Tracking"
    },
    {
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      question: "Tell me about networking in tech",
      category: "Networking"
    },
    {
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
      question: "Quick tips for staying motivated",
      category: "Motivation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/20"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-white animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent truncate">
                    SkillBuild AI
                  </h1>
                  <div className="text-blue-100 text-xs sm:text-sm flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="hidden sm:inline">Your personal learning coach</span>
                    <span className="sm:hidden">Learning coach</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/20"
                title="Menu"
              >
                {showSidebar ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>
              
              <div className="hidden sm:flex items-center space-x-2 bg-white/10 px-2 sm:px-3 py-1 sm:py-2 rounded-lg backdrop-blur-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-200" />
                <span className="text-blue-200 text-xs sm:text-sm font-medium">AI Powered</span>
              </div>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/20"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Mobile Sidebar Overlay */}
          {showSidebar && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowSidebar(false)} />
          )}

          {/* Left Sidebar - Quick Actions & Info */}
          <div className={`
            lg:col-span-1 
            ${isFullscreen ? 'hidden' : 'hidden lg:block'}
            ${showSidebar ? 'lg:hidden fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 overflow-y-auto p-4' : ''}
          `}>
            {/* Welcome Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                  {greeting}! 👋
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  I'm your AI learning coach, ready to help you achieve your goals. 
                  Ask me anything about skills, career paths, or study strategies!
                </p>
              </div>
            </div>

            {/* Quick Start Questions */}
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2" />
                Quick Start
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                Try asking me one of these popular questions:
              </p>
              <div className="space-y-2 sm:space-y-3">
                {quickStartQuestions.map((item, index) => (
                  <QuickStartButton
                    key={index}
                    icon={item.icon}
                    question={item.question}
                    category={item.category}
                  />
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-4 sm:p-6 mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">What I Can Help With</h3>
              <div className="space-y-2 sm:space-y-3 text-white text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-purple-200 flex-shrink-0" />
                  <span>Set and refine learning goals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-purple-200 flex-shrink-0" />
                  <span>Recommend skills and technologies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-200 flex-shrink-0" />
                  <span>Create personalized study plans</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-200 flex-shrink-0" />
                  <span>Track progress and milestones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-200 flex-shrink-0" />
                  <span>Career guidance and networking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-purple-200 flex-shrink-0" />
                  <span>Motivation and productivity tips</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className={`${isFullscreen ? 'lg:col-span-4' : 'lg:col-span-3'}`}>
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                      <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-white truncate">AI Learning Coach</h2>
                      <div className="text-blue-100 text-xs sm:text-sm flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse flex-shrink-0"></div>
                        <span className="hidden sm:inline">Online and ready to help</span>
                        <span className="sm:hidden">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleBackToDashboard}
                      className="hidden sm:flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
                    >
                      <Home className="w-4 h-4" />
                      <span className="text-sm font-medium">Dashboard</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Interface */}
              <div className={`
                ${isFullscreen ? 'h-[calc(100vh-120px)] sm:h-[calc(100vh-200px)]' : 'h-[500px] sm:h-[600px] lg:h-[700px]'} 
                flex flex-col
              `}>
                {/* Welcome Message */}
                <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-purple-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">
                        Welcome to SkillBuild AI! 🚀
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        I'm here to be your personal learning companion. Whether you're starting a new career path, 
                        looking to upgrade your skills, or need guidance on your learning journey, I'm ready to help! 
                        What would you like to explore today?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chatbot iframe */}
                <div className="flex-1">
                  <iframe
                    src="https://www.chatbase.co/chatbot-iframe/U8ETf-elvA0WB6FyEMj7l"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title="SkillBuild AI Learning Coach Chatbot"
                    className="w-full h-full"
                  />
                </div>

                {/* Chat Footer */}
                <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-3 sm:space-x-6 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="hidden sm:inline">AI Online</span>
                      <span className="sm:hidden">Online</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span className="hidden sm:inline">24/7 Support</span>
                      <span className="sm:hidden">24/7</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span className="hidden sm:inline">Powered by Advanced AI</span>
                      <span className="sm:hidden">AI Powered</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Brain className="w-3 h-3" />
                      <span className="hidden sm:inline">Personalized Learning</span>
                      <span className="sm:hidden">Personalized</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Start Button Component
const QuickStartButton = ({ 
  icon, 
  question, 
  category 
}: { 
  icon: React.ReactNode; 
  question: string; 
  category: string;
}) => (
  <div className="group cursor-pointer">
    <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300">
      <div className="text-purple-600 group-hover:text-purple-700 transition-colors duration-300 mt-0.5 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-purple-700 transition-colors duration-300 leading-relaxed">
          {question}
        </p>
        <p className="text-xs text-gray-500 mt-1">{category}</p>
      </div>
    </div>
  </div>
);

export default ChatBot;