import React from 'react';
import { Zap, Shield, Github, Linkedin, Mail, Star } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Empower Your Career with AI</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            SkillSync revolutionizes your professional journey with AI-driven learning paths, intelligent resume generation, and smart goal tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-800/50 p-8 rounded-2xl border border-white/10">
            <div className="flex items-center mb-6">
              <Zap className="w-8 h-8 text-purple-400 mr-4" />
              <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-white/80">
              We're transforming career development by combining artificial intelligence with human expertise. Our platform adapts to your unique learning style and career goals, providing personalized recommendations to accelerate your growth.
            </p>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-2xl border border-white/10">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-pink-400 mr-4" />
              <h2 className="text-2xl font-bold text-white">Our Technology</h2>
            </div>
            <p className="text-white/80">
              Powered by cutting-edge AI algorithms, SkillSync analyzes your progress, identifies knowledge gaps, and recommends the most effective learning resources to help you master in-demand skills faster.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10 text-center">
            <div className="text-3xl font-bold text-white mb-2">10K+</div>
            <div className="text-white/70">ACTIVE LEARNERS</div>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10 text-center">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-white/70">SUCCESS RATE</div>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10 text-center">
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-white/70">SKILLS TRACKED</div>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10 text-center">
            <div className="text-3xl font-bold text-white mb-2">4.9<Star className="w-5 h-5 inline ml-1 fill-yellow-400 text-yellow-400" /></div>
            <div className="text-white/70">USER RATING</div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Meet the Creator</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">CN</span>
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Christine Nyambwari</h3>
              <p className="text-white/80 mb-4">Full-Stack Developer & AI Enthusiast</p>
              <p className="text-white/80 mb-6">
                Passionate about creating tools that make learning and career development accessible to everyone, regardless of background or experience level.
              </p>
              
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/stine-ri" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/christine-nyambwari-8b465b2a9/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a 
                  href="mailto:christinenyambwari@gmail.com" 
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;