import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import Navbar from "./components/Navbar";

// IMPORT THE REAL PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateGig from "./pages/CreateGig";
import Dashboard from "./pages/Dashboard";

function App() {
  // 1. Get the current user from Redux
  const { currentUser } = useSelector((state) => state.user);

  // 2. Setup Socket Connection
  useEffect(() => {
    // Only connect if a user is logged in
    if (currentUser) {
      const socket = io("http://localhost:8800");

      // A. Send identity to server so it knows where to send notifications
      const userId = currentUser.id || currentUser._id;
      socket.emit("addNewUser", userId);
      console.log("🔌 Socket Connected for User:", userId); // DEBUG LOG

      // B. Listen for the 'notification' event
      socket.on("notification", (data) => {
        console.log("🔔 Notification Received:", data); // DEBUG LOG
        // Show the alert to the user
        alert(`🔔 ${data.message}`);
      });

      // C. Cleanup: Disconnect when component unmounts or user changes
      return () => {
        socket.disconnect();
      };
    }
  }, [currentUser]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add" element={<CreateGig />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;