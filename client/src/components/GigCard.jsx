import React, { useState } from "react";
import BidModal from "./BidModal";
import { useSelector } from "react-redux"; // 1. Import Redux hook

const GigCard = ({ item }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user); // 2. Get current user

  // 3. Check if the current user is the owner
  // We handle potential edge cases where ownerId might be an object or a string
  const isOwner = currentUser?._id === (item.ownerId?._id || item.ownerId);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group h-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              item.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {item.status}
            </span>
            <span className="text-emerald-600 font-extrabold text-xl">${item.budget}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
            {item.title}
          </h3>
          
          <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6">
            {item.description}
          </p>

          <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
              {item.ownerId?.name?.charAt(0) || "U"}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {item.ownerId?.name || "Unknown Client"}
            </span>
          </div>
        </div>

        {/* 4. LOGIC: Show different buttons based on status and ownership */}
        {item.status === 'Open' ? (
          isOwner ? (
            <div className="w-full bg-gray-50 text-gray-400 font-bold py-4 text-center cursor-default border-t border-gray-100 bg-gray-50/50">
              You Posted This Job
            </div>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="w-full bg-gray-50 text-gray-700 font-semibold py-4 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer border-t border-gray-100"
            >
              Submit Proposal
            </button>
          )
        ) : (
          <div className="w-full bg-gray-100 text-gray-400 font-semibold py-4 text-center cursor-not-allowed border-t border-gray-100">
            Position Filled
          </div>
        )}
      </div>

      {modalOpen && <BidModal setOpen={setModalOpen} gigId={item._id} />}
    </>
  );
};

export default GigCard;