import React, { useState } from "react";
import newRequest from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post("/auth/register", user);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
          <p className="mt-2 text-sm text-gray-600">Join our marketplace today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            
            {/* USERNAME INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                name="name"
                type="text"
                required                // EDGE CASE: Cannot be empty
                minLength={3}           // EDGE CASE: Must be > 3 chars
                placeholder="John Doe"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                onChange={handleChange}
              />
            </div>

            {/* EMAIL INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"            // EDGE CASE: Enforces @ symbol
                required                // EDGE CASE: Cannot be empty
                placeholder="email@example.com"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                required                // EDGE CASE: Cannot be empty
                minLength={6}           // EDGE CASE: Enforces security
                placeholder="Minimum 6 characters"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors shadow-md hover:shadow-lg"
          >
            Register
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;