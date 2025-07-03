import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Resume from "./Pages/Resume";
import Navbar from "./Components/Navbar";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import Logout from "./Pages/Logout";
import Progress from "./Components/Progress";
import QuizHistory from "./Components/QuizHistory";
import Quiz from "./Components/Quiz";
import MockInterview from "./Components/MockInterview";
import ChatBot from "./Components/Chatbot";
import { Toaster } from 'react-hot-toast';
import "./App.css";

// Component that conditionally shows Navbar
const AppWrapper = () => {
  const location = useLocation();

  // Hide navbar on these routes
  const hideNavbarOnRoutes = ["/", "/login", "/register", "/about", "/contact"];
  const shouldHideNavbar = hideNavbarOnRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/quiz-history" element={<QuizHistory />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/chatbot" element={<ChatBot />} />
      </Routes>
      <Toaster/>
    </>
  );
};


const App: React.FC = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
