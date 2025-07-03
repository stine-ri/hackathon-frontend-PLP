import React, { useState, useEffect, useCallback, memo } from "react";
import { User, Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle, AlertCircle, Loader, ArrowRight, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Throttle utility function
function throttle<T extends (...args: unknown[]) => unknown>(func: T, limit: number): T {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  
  return ((...args: unknown[]) => {
    if (!lastRan) {
      func(...args as Parameters<T>);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func(...args as Parameters<T>);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }) as T;
}

interface InputFieldProps {
  icon: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  isValid?: boolean;
}

const InputField = memo(({ 
  icon: Icon, 
  type, 
  placeholder, 
  value, 
  onChange, 
  showToggle = false,
  showPassword: showPass,
  onTogglePassword,
  isValid = false
}: InputFieldProps) => (
    <div className="relative transition-all duration-300">
      <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 z-10 pointer-events-none text-white/50`} />
      <input
        type={showToggle ? (showPass ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300 relative z-20 ${
          isValid ? 'border-green-400/50' : ''
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
      {isValid && (
        <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400 z-30" />
      )}
    </div>
));

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const navigate = useNavigate();

  // Optimized mouse movement handler
  useEffect(() => {
    const handleMouseMove = throttle(() => {
      // We'll remove the background animation completely for better performance
    }, 50);
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simplified validation
  const isUsernameValid = username.length >= 3;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isConfirmPasswordValid = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && acceptedTerms;

  const getPasswordStrength = useCallback(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }, [password]);

  const getStrengthColor = useCallback(() => {
    const strength = getPasswordStrength();
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-orange-500";
    if (strength <= 3) return "bg-blue-500";
    return "bg-green-500";
  }, [getPasswordStrength]);

  const getStrengthText = useCallback(() => {
    const strength = getPasswordStrength();
    if (strength <= 1) return "Weak";
    if (strength <= 2) return "Fair";
    if (strength <= 3) return "Strong";
    return "Very Strong";
  }, [getPasswordStrength]);

const handleRegister = useCallback(async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const response = await fetch("https://hackathon-backend-plp.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        confirmPassword
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    alert("Registration successful!");
    navigate("/login");
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("An unknown error occurred.");
    }
  } finally {
    setIsLoading(false);
  }
}, [username, email, password, confirmPassword, navigate]);

  const handleNavigateToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden flex items-center justify-center p-4">
      {/* Static Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-10 left-10" />
        <div className="absolute w-80 h-80 bg-pink-500/20 rounded-full blur-3xl top-60 right-10" />
      </div>

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SkillSync
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/70">Join thousands of professionals transforming their careers</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="space-y-6">
            <InputField
              icon={User}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              isValid={isUsernameValid}
            />

            <InputField
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              isValid={isEmailValid}
            />

            {/* Password Field */}
            <div>
              <InputField
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              showToggle={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              isValid={isPasswordValid}
              />
              {password && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Password Strength</span>
                <span
                  className={`font-semibold ${
                  getPasswordStrength() >= 4
                    ? 'text-green-400'
                    : getPasswordStrength() >= 3
                    ? 'text-blue-400'
                    : getPasswordStrength() >= 2
                    ? 'text-yellow-400'
                    : 'text-red-400'
                  }`}
                >
                  {getStrengthText()}
                </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getStrengthColor()}`}
                  style={{ width: `${(getPasswordStrength() / 5) * 100}%` }}
                />
                </div>
              </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <InputField
              icon={Shield}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              showToggle={true}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              isValid={isConfirmPasswordValid && confirmPassword.length > 0}
            />
            {confirmPassword.length > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                {isConfirmPasswordValid ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Passwords match</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Passwords don't match</span>
                  </>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 text-sm">
              <div className="relative mt-1 flex-shrink-0">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="sr-only"
                  required
                />
                <label 
                  htmlFor="terms"
                  className={`w-5 h-5 rounded border-2 transition-colors duration-300 flex items-center justify-center cursor-pointer ${
                    acceptedTerms 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500' 
                      : 'border-white/30 hover:border-purple-400 bg-white/10'
                  }`}
                >
                  {acceptedTerms && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              </div>
              <label htmlFor="terms" className="text-white/70">
                I agree to the <button type="button" className="text-purple-400 hover:underline">Terms of Service</button> and <button type="button" className="text-purple-400 hover:underline">Privacy Policy</button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`group w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                isLoading || !isFormValid
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-white/70">
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={handleNavigateToLogin}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 mt-6 text-white/60 text-sm">
            <Shield className="w-4 h-4" />
            <span>Your data is protected with enterprise-grade security</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;