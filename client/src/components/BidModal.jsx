import React, { useState } from "react";
import newRequest from "../api/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BidModal = ({ setOpen, gigId }) => {
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // 1. Prevents double clicks
  const [success, setSuccess] = useState(false); // 2. Controls Success UI
  
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert("Please login to bid!");
        return navigate("/login");
    }

    setLoading(true); // Disable button immediately

    try {
      await newRequest.post("/bids", { gigId, price, message });
      setSuccess(true); // Show success message
      // Note: We do NOT close modal immediately so user sees the success
    } catch (err) {
      // If user already bid (409), treat as success/info to stop them trying again
      if (err.response?.status === 409) {
         alert("You have already placed a bid on this gig.");
         setOpen(false);
      } else {
         alert(err.response?.data?.message || "Failed to submit bid");
         setLoading(false); // Re-enable button on error
      }
    }
  };

  return (
    // BACKDROP
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
      onClick={() => setOpen(false)}
    >
      {/* MODAL CONTENT */}
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

        {/* LOGIC: Show Form OR Success Message */}
        {!success ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit Proposal</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Your Bid ($)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 500"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={loading} // Lock input while sending
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Cover Letter</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Why are you the best fit?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading} // Lock input while sending
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading} // Prevent double clicks
                className={`w-full py-3 rounded-lg font-bold text-white transition shadow-lg ${
                    loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5'
                }`}
              >
                {loading ? "Sending..." : "Send Proposal"}
              </button>
            </form>
          </>
        ) : (
          // SUCCESS UI
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Proposal Sent!</h2>
            <p className="text-gray-500 mb-6">The client has been notified.</p>
            <button 
              onClick={() => setOpen(false)}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-black transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidModal;