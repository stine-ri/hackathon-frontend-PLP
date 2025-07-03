import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold text-purple-700 mb-2">Logging out...</h2>
        <p className="text-gray-600">Redirecting you to login page.</p>
      </div>
    </div>
  );
};

export default Logout;