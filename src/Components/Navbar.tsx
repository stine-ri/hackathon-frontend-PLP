import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 text-white shadow-lg relative overflow-hidden">
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-pink-600/20 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-pink-400 group-hover:text-pink-300 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <div className="absolute -inset-1 bg-pink-400/20 rounded-full blur group-hover:bg-pink-300/30 transition-all duration-300"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent group-hover:from-pink-200 group-hover:to-white transition-all duration-300">
              SkillSync
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" label="Home" />
            <NavLink to="/login" label="Login" />
            <NavLink to="/register" label="Register" />
            <NavLink to="/dashboard" label="Dashboard" />
            <NavLink to="/resume" label="Resume" />
            <NavLink to="/progress" label="Progress" />
            <NavLink to="/quiz-history" label="Quiz History" />
            <NavLink to="/mock-interview" label="Mock Interview" />
            <NavLink to="/quiz" label="Quiz" />
            <NavLink to="/chatbot" label="Chatbot" />

            {/* CTA Button */}
            <Link 
              to="/login" 
              className="ml-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 active:scale-95"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button and CTA */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile CTA Button - Visible at all times */}
            <Link 
              to="/login"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Get Started
            </Link>
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-purple-700/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-[700px] opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="pt-4 space-y-2 border-t border-purple-600/30">
            <MobileNavLink to="/" label="Home" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/login" label="Login" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/register" label="Register" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/dashboard" label="Dashboard" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/resume" label="Resume" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/progress" label="Progress" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/quiz-history" label="Quiz History" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/mock-interview" label="Mock Interview" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/quiz" label="Quiz" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/chatbot" label="Chatbot" onClick={() => setIsMenuOpen(false)} />

            {/* Full-width CTA in menu */}
            <Link 
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full font-medium text-center transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group hover:bg-purple-700/30 hover:shadow-lg hover:shadow-purple-500/10"
  >
    <span className="relative z-10 group-hover:text-pink-200 transition-colors duration-300">
      {label}
    </span>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300"></div>
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-purple-700/30 hover:pl-6 hover:shadow-md hover:shadow-purple-500/10 group"
  >
    <span className="group-hover:text-pink-200 transition-colors duration-300">
      {label}
    </span>
  </Link>
);

export default Navbar;