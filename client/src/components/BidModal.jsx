import React, { useState } from "react";
import newRequest from "../api/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BidModal = ({ setOpen, gigId }) => {
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert("Please login to bid!");
        return navigate("/login");
    }

    try {
      await newRequest.post("/bids", { gigId, price, message });
      alert("Bid submitted successfully!");
      setOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit bid");
    }
  };

  return (
    // BACKDROP: Closes modal when clicking the dark area
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
      onClick={() => setOpen(false)}
    >
      {/* MODAL CONTENT: Stops click from closing the modal */}
      <div 
        className="bg-white p-8 rounded-2xl shadow-2xl w-96 relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-xl transition"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit Proposal</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Your Bid ($)</label>
            <input
              type="number"
              required
              min="1"   // Prevents negative numbers
              step="1"  // Prevents decimals (optional, remove if you want cents)
              placeholder="e.g. 500"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Cover Letter</label>
            <textarea
              required
              rows="4"
              placeholder="Why are you the best fit?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Send Proposal
          </button>
        </form>
      </div>
    </div>
  );
};

export default BidModal;