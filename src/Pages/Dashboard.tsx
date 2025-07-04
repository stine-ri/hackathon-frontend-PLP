import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoalForm from "../Components/GoalForm";
import Recommendations from "../Components/Recommendations";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Sparkles, 
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  Award,
  MessageCircle,
  Bot,
  ArrowRight
} from "lucide-react";

type Skill = {
  skill: string;
  importance: string;
  level: string;
};

type RoadmapStep = {
  week: string;
  topics: string[];
  resources: string[];
  hours: number;
};

interface AIResponse {
  goal: string;
  recommendedSkills: Skill[];
  roadmap: RoadmapStep[];
  advice: string;
}

interface DashboardStats {
  totalGoals: number;
  completedSkills: number;
  currentStreak: number;
  lastActive: string;
  lastLoginDate: string;
  goalsHistory: string[];
  completedSkillsHistory: string[];
}

interface UserActivity {
  date: string;
  action: string;
  details: string;
}
interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // User-specific state management 
  const [stats, setStats] = useState<DashboardStats>({
    totalGoals: 0,
    completedSkills: 0,
    currentStreak: 1,
    lastActive: "Just now",
    lastLoginDate: new Date().toISOString(),
    goalsHistory: [],
    completedSkillsHistory: []
  });
  
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [greeting, setGreeting] = useState("");

  // Load user data and set greeting
// Update the greeting effect to use Kenyan time
useEffect(() => {
  loadUserData();
  updateLastActive();
  
  // Get current time in Kenyan timezone (UTC+3)
  const options = { timeZone: 'Africa/Nairobi' };
  const kenyanTime = new Date().toLocaleString('en-US', options);
  const hour = new Date(kenyanTime).getHours();
  
  if (hour < 12) setGreeting("Good morning");
  else if (hour < 18) setGreeting("Good afternoon");
  else setGreeting("Good evening");
}, []);


// Add online status detection
useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);


  const loadUserData = () => {
    //  Check if user is new by looking for a flag in localStorage
  const isNewUser = !localStorage.getItem('hasVisitedBefore');
  
  if (isNewUser) {
    // Initialize fresh stats for new user
    setStats({
      totalGoals: 0,
      completedSkills: 0,
      currentStreak: 1,
      lastActive: "Just now",
      lastLoginDate: new Date().toISOString(),
      goalsHistory: [],
      completedSkillsHistory: []
    });
    
    setUserActivities([
      { date: new Date().toISOString(), action: "Login", details: "First time dashboard access" }
    ]);
    
    // Mark user as no longer new
    localStorage.setItem('hasVisitedBefore', 'true');
  } else {
    
    //  Initialize with some sample data for demonstration
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    setStats(prev => ({
      ...prev,
      totalGoals: 3,
      completedSkills: 12,
      lastLoginDate: lastWeek.toISOString()
    }));
    
    setUserActivities([
      { date: new Date().toISOString(), action: "Login", details: "Dashboard accessed" },
      { date: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), action: "Goal Set", details: "Learn React fundamentals" },
      { date: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), action: "Skill Completed", details: "JavaScript ES6" }
    ]);
   }
  };

  const saveUserData = (newStats: DashboardStats, newActivities: UserActivity[]) => {
    
  
    setStats(newStats);
    setUserActivities(newActivities);
    localStorage.setItem('hasVisitedBefore', 'true');
  };

  const updateLastActive = () => {
    setStats(prev => ({
      ...prev,
      lastActive: "Just now"
    }));
  };

  const addActivity = (action: string, details: string) => {
    const newActivity: UserActivity = {
      date: new Date().toISOString(),
      action,
      details
    };
    
    const updatedActivities = [newActivity, ...userActivities].slice(0, 50); // Keep last 50 activities
    setUserActivities(updatedActivities);
    
    
  };

  const calculateStreak = (): number => {
    if (!userActivities || userActivities.length === 0) return 1;
    
    const today = new Date();
    const activities = userActivities.filter(activity => {
      const activityDate = new Date(activity.date);
      const diffTime = today.getTime() - activityDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30; // Consider activities from last 30 days
    });
    
         // Group activities by date
    const activityDates = new Set(
      activities.map(activity => 
      activity?.date ? new Date(activity.date).toDateString() : ''
      ).filter(Boolean)
    );
    
    let streak = 0;
    const currentDate = new Date();
    
    // Count consecutive days with activity
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
      if (activityDates.has(checkDate.toDateString())) {
        streak++;
      } else if (streak > 0) {
        break; // Streak broken
      }
    }
    
    return Math.max(streak, 1);
  };

  const getLastLoginDisplay = (): string => {
    const lastLogin = new Date(stats.lastLoginDate);
    const now = new Date();
    const diffTime = now.getTime() - lastLogin.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 5) return `${diffMinutes} minutes ago`;
    return "Just now";
  };

  const handleGoalSubmit = async (goal: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://hackathon-backend-plp.onrender.com/api/ai/recommend", {
        goal,
      });
      setAiData(res.data);
      
      // Update stats and track activity
      const newStats = {
        ...stats,
        totalGoals: (stats.totalGoals || 0) + 1,
        lastActive: "Just now",
        goalsHistory: [...stats.goalsHistory, goal],
        currentStreak: calculateStreak()
      };
      
      addActivity("Goal Set", goal);
      saveUserData(newStats, userActivities);
      
      // Data received successfully
    } catch (err) {
      console.error(err);
      setError("Failed to fetch AI recommendations. Please try again.");
      addActivity("Error", "Failed to get AI recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillCompleted = (skillName: string) => {
    const newStats = {
      ...stats,
      completedSkills: (stats.completedSkills || 0) + 1,
      lastActive: "Just now",
      completedSkillsHistory: [...(stats.completedSkillsHistory || []), skillName],
      currentStreak: calculateStreak()
    };
    
    addActivity("Skill Completed", skillName);
    saveUserData(newStats, userActivities);
  };

  const handleQuickAction = (actionName: string) => {
    addActivity("Quick Action", actionName);
    updateLastActive();
  };

  const handleRetry = () => {
    setError("");
    if (aiData?.goal) {
      handleGoalSubmit(aiData.goal);
    }
  };

  const handleChatWithAI = () => {
    navigate('/chatbot');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  {isOnline ? (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                      ) : (
                       <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                      )}
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                  {greeting}! 👋
                </h1>
                <p className="text-purple-200 text-lg">Ready to level up your skills?</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Brain className="w-6 h-6 text-pink-300" />
              <span className="text-pink-300 font-medium">AI Coach Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Target className="w-6 h-6" />}
            title="Total Goals"
            value={stats.totalGoals.toString()}
            subtitle="Goals set"
            color="purple"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Skills Mastered"
            value={stats.completedSkills.toString()}
            subtitle="Skills completed"
            color="green"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Current Streak"
            value={`${calculateStreak()} days`}
            subtitle="Keep it up!"
            color="blue"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            title={isOnline ? "Online Now" : "Last Login"}
             value={isOnline ? "Active" : getLastLoginDisplay()}
             subtitle={isOnline ? "You're online" : "Activity status"}
             color="pink"
          />
        </div>

        {/* Main Content Area - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Goal Form and Quick Actions */}
          <div className="lg:col-span-1">
            {/* Goal Form Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Coach</h2>
                    <p className="text-purple-100 text-sm">Set your learning goal</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <GoalForm onSubmit={handleGoalSubmit} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Award className="w-5 h-5 text-purple-600 mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <QuickActionButton
                  icon={<Target className="w-4 h-4" />}
                  label="View Learning Path"
                  onClick={() => handleQuickAction("View Learning Path")}
                />
                <QuickActionButton
                  icon={<TrendingUp className="w-4 h-4" />}
                  label="Track Progress"
                  onClick={() => handleQuickAction("Track Progress")}
                />
                <QuickActionButton
                  icon={<Brain className="w-4 h-4" />}
                  label="AI Insights"
                  onClick={() => handleQuickAction("AI Insights")}
                />
              </div>
            </div>

            {/* Chat with AI CTA */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">SkillBuild AI Chat</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get personalized guidance and instant answers to your learning questions
                </p>
                <button
                  onClick={handleChatWithAI}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 flex items-center justify-center space-x-2 group"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat with AI</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-blue-100">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span>{isOnline ? 'AI Online' : 'Offline'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - AI Recommendations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Recommendations</h2>
                    <p className="text-purple-100 text-sm">Personalized learning suggestions</p>
                  </div>
                  {loading && (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-4 h-4 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-4 h-4 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 min-h-[600px] flex flex-col">
                {/* Loading State */}
                {loading && (
                  <div className="flex flex-col items-center justify-center flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                      <Brain className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-purple-600 font-medium mt-4 animate-pulse">
                      AI is analyzing your goal...
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      This may take a few moments
                    </p>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="flex flex-col items-center justify-center flex-1">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-red-600 font-medium mb-2">Oops! Something went wrong</p>
                    <p className="text-gray-500 text-sm text-center mb-4">{error}</p>
                    <button
                      onClick={handleRetry}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && !aiData && (
                  <div className="flex flex-col items-center justify-center flex-1">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-gray-600 font-medium mb-2">Ready to start your journey?</p>
                    <p className="text-gray-500 text-sm text-center mb-6">
                      Set a learning goal to get personalized AI recommendations
                    </p>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 max-w-md">
                      <div className="text-center">
                        <Bot className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                        <p className="text-purple-600 text-sm font-medium mb-2">
                          💬 Need help getting started?
                        </p>
                        <p className="text-gray-600 text-xs mb-3">
                          Chat with our AI assistant for guidance and personalized advice
                        </p>
                        <button
                          onClick={handleChatWithAI}
                          className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                        >
                          Start Chat
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {!loading && !error && aiData && (
                  <div className="animate-fadeIn flex-1">
                    <Recommendations 
                      data={aiData} 
                      onSkillCompleted={handleSkillCompleted}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {/* Floating Chat Button - Visible on all screens */}
<div className="fixed bottom-6 right-6 z-50">
  <button
    onClick={handleChatWithAI}
    className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center relative group"
    title="Chat with AI"
  >
    <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
    
    {/* Desktop-only badge */}
    <div className="hidden md:block absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
      AI
    </div>
    
    {/* Pulse animation effect */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 pointer-events-none"></div>
  </button>
</div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  subtitle: string; 
  color: 'purple' | 'green' | 'blue' | 'pink';
}) => {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50',
    green: 'from-green-500 to-green-600 text-green-600 bg-green-50',
    blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50',
    pink: 'from-pink-500 to-pink-600 text-pink-600 bg-pink-50'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  icon, 
  label, 
  onClick 
}) => {
  const handleClick = () => {
    onClick(); // Execute the original onClick handler
    toast(`Check your preferred action in the current page 😊`, {
      icon: '👆',
      style: {
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#fff',
        padding: '14px 18px',
        fontSize: '14px',
      },
      position: 'bottom-center',
      duration: 3000,
    });
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 group"
      >
        <div className="text-purple-600 group-hover:text-purple-700 transition-colors duration-300">
          {icon}
        </div>
        <span className="text-gray-700 group-hover:text-purple-700 font-medium transition-colors duration-300">
          {label}
        </span>
      </button>
      
      
      <Toaster 
        toastOptions={{
          style: {
            background: 'rgba(30, 30, 30, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </>
  );
};

export default Dashboard;
