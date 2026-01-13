import React, { useState } from "react";
import newRequest from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const CreateGig = () => {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    budget: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Inputs must match model: title, description, budget
      await newRequest.post("/gigs", inputs);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to create gig");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a New Job</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Job Title</label>
            <input
              name="title"
              type="text"
              placeholder="e.g. Build a React Website"
              required
              maxLength={100}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Budget ($)</label>
            <input
              name="budget"
              type="number"
              min="5"
              placeholder="e.g. 100"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
            <textarea
              name="description"
              rows="6"
              placeholder="Describe the project details..."
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition transform active:scale-95"
          >
            Publish Gig
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;