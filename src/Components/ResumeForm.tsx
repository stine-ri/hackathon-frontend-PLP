import React, { useState } from "react";

interface ResumeData {
  name: string;
  email: string;
  skills: string;
  projects: string;
}

interface Props {
  onGenerate: (data: ResumeData) => void;
  isPreviewMode?: boolean;
  initialData?: ResumeData | null;
}
const ResumeForm: React.FC<Props> = ({ onGenerate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ name, email, skills, projects });
    setName("");
    setEmail("");
    setSkills("");
    setProjects("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Skills (comma-separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        className="w-full p-2 border rounded"
      ></textarea>
      <textarea
        placeholder="Projects (comma-separated)"
        value={projects}
        onChange={(e) => setProjects(e.target.value)}
        className="w-full p-2 border rounded"
      ></textarea>
      <button
        type="submit"
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
      >
        Generate Resume
      </button>
    </form>
  );
};

export default ResumeForm;
