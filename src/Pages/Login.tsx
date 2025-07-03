import React, { useState, useEffect, useCallback } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, Loader, ArrowRight, Shield, Zap, Users, Github, Chrome } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';


interface InputFieldProps {
  icon: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  showToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const InputField = React.memo(({ 
  icon: Icon, 
  type, 
  placeholder, 
  value, 
  onChange, 
  name,
  showToggle = false,
  showPassword: showPass,
  onTogglePassword
}: InputFieldProps) => (
  <div className="relative group">
    <div className={`relative transition-all duration-300 ${
      name === 'email' || name === 'password' ? 'transform scale-105' : ''
    }`}>
      <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 z-10 pointer-events-none ${
        name === 'email' || name === 'password' ? 'text-purple-400' : 'text-white/50'
      }`} />
      <input
        type={showToggle ? (showPass ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300 relative z-20 ${
          (name === 'email' && value.includes('@')) || (name === 'password' && value.length >= 6) ? 'border-green-400/50' : ''
        }`}
        required
      />
      {showToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors z-30"
        >
          {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  </div>
));

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  // Optimized mouse movement handler
  // Optimized mouse movement handler
  useEffect(() => {
    // Mouse movement handler removed as mousePosition state is unused
  }, []);
const handleLogin = useCallback(async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const response = await fetch("https://hackathon-backend-plp.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store token and user data in localStorage
    localStorage.setItem("token", data.token);
    
    // Store the entire user object if available, or specific fields
    if (data.user) {
      localStorage.setItem("user", JSON.stringify({
        id: data.user.id,
        username: data.user.username || data.user.name || data.user.email.split('@')[0],
        email: data.user.email,
        // Add any other user fields you want to store
      }));
    } else {
      // Fallback if user object isn't provided
      localStorage.setItem("user", JSON.stringify({
        username: email.split('@')[0],
        email: email
      }));
    }

    alert("Login successful! Welcome back to SkillSync!");

    // Navigate based on user role (if applicable)
    navigate("/dashboard"); // Or "/admin" if needed
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Login failed. Please try again.");
    }
  } finally {
    setIsLoading(false);
  }
}, [email, password, navigate]);

  const handleSocialLogin = useCallback((provider: string) => {
   toast(`${provider} login coming soon!`, {
      icon: '🔜',
      style: {
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#fff',
        padding: '16px',
      },
      position: 'bottom-center'
    });
  }, []);

  const handleNavigateToRegister = useCallback(() => {
    navigate('/register');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden flex items-center justify-center p-4">
      {/* Static Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-10 left-10" />
        <div className="absolute w-80 h-80 bg-pink-500/20 rounded-full blur-3xl top-60 right-10" />
        <div className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl bottom-20 left-1/2" />
      </div>

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SkillSync
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/70">Continue your career transformation journey</p>
        </div>

        {/* Social Login Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-3 text-white hover:bg-white/15 transition-all duration-300 group"
          >
            <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Google</span>
          </button>
          <button
            onClick={() => handleSocialLogin('GitHub')}
            className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-3 text-white hover:bg-white/15 transition-all duration-300 group"
          >
            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white/70">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="space-y-6">
            {/* Email Field */}
            <InputField
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              name="email"
            />

            {/* Password Field */}
            <InputField
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              name="password"
              showToggle={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-3 cursor-pointer group select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                    rememberMe 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500' 
                      : 'border-white/30 group-hover:border-purple-400 bg-white/10'
                  }`}>
                    {rememberMe && (
                      <svg 
                        className="w-3 h-3 text-white transition-opacity duration-200" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-white/70 group-hover:text-white transition-colors">
                  Keep me logged in
                </span>
              </label>
              <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-shake">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email.includes('@') || password.length < 6}
              className={`group w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                isLoading || !email.includes('@') || password.length < 6
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-white/70">
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={handleNavigateToRegister}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </form>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">10K+</div>
            <div className="text-xs text-white/60">Active Users</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">99.9%</div>
            <div className="text-xs text-white/60">Uptime</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">24/7</div>
            <div className="text-xs text-white/60">Support</div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-2 mt-6 text-white/60 text-sm">
          <Shield className="w-4 h-4" />
          <span>Protected by enterprise-grade encryption</span>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;