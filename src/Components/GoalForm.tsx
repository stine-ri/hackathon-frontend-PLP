import { useState } from "react";

interface Props { onSubmit: (goal: string) => void; }

const GoalForm: React.FC<Props> = ({ onSubmit }) => { const [goal, setGoal] = useState("");

const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(goal); setGoal(""); };

return ( <form onSubmit={handleSubmit} className="flex gap-2 p-4"> <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Enter your career goal..." className="flex-1 p-2 rounded border focus:outline-none" /> <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Submit</button> </form> ); };

export default GoalForm;
