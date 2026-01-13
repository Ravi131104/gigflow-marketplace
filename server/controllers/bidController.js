const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

// 1. ADD BID (With Edge Case Checks)
const addBid = async (req, res, next) => {
  try {
    const { gigId, price, message } = req.body;
    const freelancerId = req.userId; // Coming from verifyToken middleware

    // Check if Gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json("Gig not found!");

    // EDGE CASE 1: Prevent Self-Bidding
    if (gig.ownerId.toString() === freelancerId) {
      return res.status(403).json("You cannot bid on your own gig!");
    }

    // EDGE CASE 2: Prevent Double Bidding
    const existingBid = await Bid.findOne({ gigId, freelancerId });
    if (existingBid) {
      return res.status(409).json("You have already placed a bid on this gig.");
    }

    // EDGE CASE 3: Prevent bidding on closed gigs
    if (gig.status !== 'Open') {
      return res.status(400).json("This gig is no longer accepting proposals.");
    }

    // Create Bid
    const newBid = new Bid({
      gigId,
      freelancerId,
      price,
      message,
    });

    await newBid.save();
    res.status(201).json(newBid);
  } catch (err) {
    next(err);
  }
};

// 2. HIRE FREELANCER (Secure Atomic Version + Socket.io)
const hireFreelancer = async (req, res) => {
  const { bidId } = req.params;
  const { gigId } = req.body; 

  try {
    // --- STEP 1: ATOMIC LOCK (The "Secure Logic Flow") ---
    // We attempt to find the Gig and update it ONLY if status is 'Open'.
    // This prevents Race Conditions. If it's already 'Assigned', this returns null.
    const gig = await Gig.findOneAndUpdate(
      { _id: gigId, status: "Open" }, // Condition: MUST be Open
      { $set: { status: "Assigned" } }, // Action: Change to Assigned
      { new: true } // Return the updated doc
    );

    // If 'gig' is null, it means someone else hired a freelancer milliseconds ago
    if (!gig) {
      return res.status(400).json({ 
        message: "Action Failed: This gig was just assigned to someone else!" 
      });
    }

    // --- STEP 2: UPDATE BIDS ---
    // Now that we secured the Gig, we safely update the bids
    const winningBid = await Bid.findByIdAndUpdate(
      bidId,
      { status: 'hired' },
      { new: true }
    );

    // Reject all other bids
    await Bid.updateMany(
      { gigId: gigId, _id: { $ne: bidId } }, 
      { status: 'rejected' }
    );

    // --- STEP 3: REAL-TIME NOTIFICATION (Socket.io) ---
    const io = req.app.get('socketio');
    const onlineUsers = req.app.get('onlineUsers');

    if (onlineUsers) {
      // Find the freelancer in the online users list
      const freelancerSocket = onlineUsers.find(
        (user) => user.userId === winningBid.freelancerId.toString()
      );

      if (freelancerSocket) {
        io.to(freelancerSocket.socketId).emit("notification", {
          message: `Congrats! You have been hired for "${gig.title}"`,
          gigId: gig._id,
        });
      }
    }
    // -------------------------------------

    res.status(200).json({ message: "Freelancer hired successfully!", winningBid });

  } catch (error) {
    console.log(error);
    // Ideally, we would rollback here, but for this assignment, we log the error.
    res.status(500).json({ message: "Hiring failed", error: error.message });
  }
};

// 3. GET BIDS FOR A GIG
const getBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ gigId: req.params.gigId }).populate("freelancerId", "name email");
    res.status(200).json(bids);
  } catch (err) {
    next(err);
  }
};

module.exports = { addBid, hireFreelancer, getBids };