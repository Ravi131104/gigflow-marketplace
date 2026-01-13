import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import newRequest from "../api/axiosInstance";
import { logout } from "../redux/userSlice";
import { FiLogOut, FiUser, FiPlusSquare, FiGrid } from "react-icons/fi"; // Icons

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-emerald-600 tracking-tight flex items-center gap-2">
          Gig<span className="text-gray-800">Flow.</span>
        </Link>

        {/* Links */}
        <div className="flex gap-6 items-center font-medium">
          {currentUser ? (
            <>
              <span className="hidden md:flex items-center text-gray-500 text-sm gap-1">
                <FiUser /> {currentUser.name}
              </span>
              
              <Link to="/add" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition">
                <FiPlusSquare /> <span className="hidden sm:block">Post Gig</span>
              </Link>
              
              <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition">
                <FiGrid /> <span className="hidden sm:block">Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100 transition text-sm font-semibold"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-emerald-600 transition">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-emerald-700 hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;