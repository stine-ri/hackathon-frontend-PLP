import axios from "axios";

export const getRecommendations = async (goal: string) => {
  const res = await axios.post("https://hackathon-backend-plp.onrender.com/api/ai/recommend", { goal });
  return res.data;
};