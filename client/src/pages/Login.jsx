import React, { useState } from "react";
import newRequest from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await newRequest.post("/auth/login", { email, password });
      
      // --- DEBUGGING LOGS (Check your browser console!) ---
      console.log("LOGIN RESPONSE:", res.data); 
      
      // --- THE FIX ---
      // ❌ OLD ERROR: dispatch(loginSuccess(res.data.user)); 
      // ✅ CORRECT: res.data IS the user object.
      
      dispatch(loginSuccess(res.data)); 
      
      // Save to local storage correctly
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      
      navigate("/");
    } catch (err) {
      dispatch(loginFailure());
      setError(err.response?.data?.message || "Login failed!");
      console.error("LOGIN ERROR:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              Sign in
            </button>
          </div>
          
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;