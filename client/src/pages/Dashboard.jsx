import React, { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest"; 
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// FIX: Removed unused 'FiDollarSign' to prevent Build Failure
import { FiBriefcase, FiMessageSquare, FiUser } from "react-icons/fi";

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [myGigs, setMyGigs] = useState([]);
  const [selectedGigBids, setSelectedGigBids] = useState([]);
  const [selectedGigId, setSelectedGigId] = useState(null);

  useEffect(() => {
    if (!currentUser) return navigate("/login");
    const fetchMyGigs = async () => {
      try {
        const res = await newRequest.get(`/gigs?search=`);
        const currentUserId = currentUser.id || currentUser._id;
        
        const userGigs = res.data.filter(gig => 
            (gig.userId === currentUserId) || 
            (gig.ownerId?._id === currentUserId) || 
            (gig.ownerId === currentUserId)
        );
        setMyGigs(userGigs);
      } catch (err) { console.error(err); }
    };
    fetchMyGigs();
  }, [currentUser, navigate]);

  const handleViewBids = async (gigId) => {
    try {
      setSelectedGigId(gigId);
      const res = await newRequest.get(`/bids/${gigId}`);
      setSelectedGigBids(res.data);
    } catch (err) { alert("Could not fetch bids."); }
  };

  const handleHire = async (bidId, gigId) => {
    if(!window.confirm("Hire this freelancer? This will reject all other bids.")) return;
    try {
      await newRequest.patch(`/bids/${bidId}/hire`, { gigId });
      alert("Freelancer hired successfully!");
      window.location.reload(); 
    } catch (err) {
      console.error("Hiring Error:", err);
      alert(err.response?.data?.message || err.response?.data || "Hiring failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">Employer Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Gigs List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-gray-500 uppercase tracking-wide mb-4">My Postings</h2>
          {myGigs.length === 0 ? <p className="text-gray-400">No active gigs.</p> : (
            <div className="space-y-3">
              {myGigs.map((gig) => (
                <div 
                  key={gig._id} 
                  onClick={() => handleViewBids(gig._id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all shadow-sm ${
                    selectedGigId === gig._id 
                    ? 'border-emerald-500 ring-1 ring-emerald-500 bg-white' 
                    : 'border-gray-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <h3 className="font-bold text-gray-800 mb-1">{gig.title}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${gig.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {gig.status}
                    </span>
                    <span className="text-gray-500 font-medium">${gig.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Bids Detail */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 min-h-[500px]">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
              {selectedGigId ? "Applicant Proposals" : "Select a job to view applicants"}
            </h2>

            {!selectedGigId && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <FiBriefcase size={48} className="mb-4 opacity-50"/>
                <p>Click on a job from the left list to manage bids</p>
              </div>
            )}

            <div className="space-y-6">
              {selectedGigBids.map((bid) => (
                <div key={bid._id} className="group border border-gray-200 p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                        <FiUser size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{bid.freelancerId?.name || "Unknown User"}</h4>
                        <p className="text-sm text-gray-500">{bid.freelancerId?.email || "No Email"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-2xl font-extrabold text-emerald-600">${bid.price}</span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        bid.status === 'Hired' ? 'text-green-600' : bid.status === 'Rejected' ? 'text-red-500' : 'text-yellow-600'
                      }`}>
                        {bid.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 text-gray-700 italic">
                    <FiMessageSquare className="inline mr-2 text-gray-400"/>
                    "{bid.message}"
                  </div>

                  {(bid.status !== 'Hired' && bid.status !== 'Rejected') && (
                    <div className="flex justify-end pt-2">
                      <button 
                        onClick={() => handleHire(bid._id, bid.gigId)} 
                        className="bg-black text-white px-6 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition transform active:scale-95 shadow-lg"
                      >
                        Hire Applicant
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {selectedGigId && selectedGigBids.length === 0 && (
                 <p className="text-center text-gray-500 py-10">No bids received yet for this job.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;