import React, { useEffect, useState } from "react";
import newRequest from "../api/axiosInstance";
import GigCard from "../components/GigCard";
import { FiSearch } from "react-icons/fi";

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const res = await newRequest.get(`/gigs?search=${search}`);
        
        // FILTER HERE: Only show "Open" gigs to the public
        const openGigs = res.data.filter(gig => gig.status === "Open");
        
        setGigs(openGigs);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchGigs();
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-emerald-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Find the perfect <span className="text-emerald-400">freelance</span> services
        </h1>
        <p className="text-emerald-100 mb-8 text-lg max-w-2xl mx-auto">
          Post a job or hire a freelancer in minutes. Safe, secure, and fast.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative flex items-center">
          <FiSearch className="absolute left-4 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search for 'Web Design', 'Writing'..."
            className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-emerald-500 pl-4">
          Latest Opportunities
        </h2>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading amazing gigs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gigs.length > 0 ? (
              gigs.map((gig) => <GigCard key={gig._id} item={gig} />)
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 text-lg">No gigs found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;