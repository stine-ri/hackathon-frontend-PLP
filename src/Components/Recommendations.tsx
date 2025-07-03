interface Skill {
  skill: string;
  importance: string;
  level: string;
}

interface RoadmapStep {
  week: string;
  topics: string[];
  resources: string[];
  hours: number;
}

interface AIResponse {
  goal: string;
  recommendedSkills: Skill[];
  roadmap: RoadmapStep[]; 
  advice: string;
}


interface RecommendationsProps {
  data: AIResponse;
  onSkillCompleted?: (skillName: string) => void;
}


const Recommendations: React.FC<RecommendationsProps> = ({ 
  data, 
  onSkillCompleted 
}) => {
  if (!data) return null;

  const handleSkillComplete = (skillName: string) => {
    if (onSkillCompleted) {
      onSkillCompleted(skillName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Goal Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
        <h2 className="text-xl font-bold text-purple-800 mb-1">
          Your Goal: <span className="text-purple-600">{data.goal}</span>
        </h2>
        <p className="text-purple-500 text-sm">
          Here are your personalized recommendations to achieve this goal
        </p>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recommended Skills
          </h3>
        </div>
        <div className="p-4">
          <ul className="space-y-3">
            {data.recommendedSkills.map((skill, idx) => (
  <li key={idx} className="flex items-center group">
    <button 
      onClick={() => handleSkillComplete(skill.skill)}
      className="mr-3 text-purple-500 hover:text-purple-700 transition-colors"
      title="Mark as completed"
      aria-label={`Mark ${skill.skill} as completed`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
    <span className="text-gray-800 group-hover:text-purple-700 transition-colors">
      {skill.skill} – {skill.importance} – {skill.level}
    </span>
  </li>
))}

          </ul>
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Learning Roadmap
          </h3>
        </div>
        <div className="p-4">
          <ol className="space-y-3">
            {data.roadmap.map((step, idx) => (
  <li key={idx} className="flex flex-col space-y-1 border-b pb-3">
    <span className="text-purple-600 font-semibold">Week {step.week}</span>
    <span className="text-gray-800">
      <strong>Topics:</strong> {step.topics.join(", ")}
    </span>
    <span className="text-gray-800">
      <strong>Resources:</strong> {step.resources.join(", ")}
    </span>
    <span className="text-gray-600">
      <strong>Estimated Hours:</strong> {step.hours}
    </span>
  </li>
))}

          </ol>
        </div>
      </div>

      {/* AI Advice Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
        <h3 className="text-sm font-semibold text-purple-700 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          AI ADVICE
        </h3>
        <p className="text-gray-700 italic">{data.advice}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
          Save Plan
        </button>
        <button className="px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-all">
          Share
        </button>
      </div>
    </div>
  );
};

export default Recommendations;