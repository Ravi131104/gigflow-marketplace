const Bid = require('../models/bid');
const Gig = require('../models/gig');

// 1. ADD BID (With Validation)
const addBid = async (req, res, next) => {
  try {
    const { gigId, price, message } = req.body;
    const freelancerId = req.userId; // From verifyToken middleware

    // Check if Gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json("Gig not found!");

    // Prevent Self-Bidding
    if (gig.userId === freelancerId) {
      return res.status(403).json("You cannot bid on your own gig!");
    }

    // Prevent Double Bidding
    const existingBid = await Bid.findOne({ gigId, freelancerId });
    if (existingBid) {
      return res.status(409).json("You have already placed a bid on this gig.");
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

// 2. HIRE FREELANCER (Atomic & Secure)
const hireFreelancer = async (req, res, next) => {
  const { bidId } = req.params;
  const { gigId } = req.body; // Needed to find the gig and lock it

  try {
    // --- STEP 1: ATOMIC LOCK ---
    // Only update if status is EXACTLY 'Open'. If it is 'Assigned', this fails.
    const gig = await Gig.findOneAndUpdate(
      { _id: gigId, status: "Open" }, 
      { $set: { status: "Assigned" } }, 
      { new: true }
    );

    if (!gig) {
      return res.status(400).json("This gig has already been assigned to someone else!");
    }

    // --- STEP 2: UPDATE BIDS ---
    // Set the chosen bid to 'Hired'
    const winningBid = await Bid.findByIdAndUpdate(
      bidId,
      { status: 'Hired' }, // Capitalized for consistency
      { new: true }
    );

    // Reject everyone else
    await Bid.updateMany(
      { gigId: gigId, _id: { $ne: bidId } }, 
      { status: 'Rejected' }
    );

    // --- STEP 3: NOTIFICATION ---
    // (Optional: Only works if socket is set up in server.js)
    const io = req.app.get('socketio');
    const onlineUsers = req.app.get('onlineUsers');
    
    if (io && onlineUsers) {
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

    res.status(200).json({ message: "Freelancer hired successfully!", winningBid });

  } catch (err) {
    next(err);
  }
};

// 3. GET BIDS
const getBids = async (req, res, next) => {
  try {
    // Populate adds the freelancer's name/email/img to the result
    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate("freelancerId", "name email img"); 
      
    res.status(200).json(bids);
  } catch (err) {
    next(err);
  }
};

module.exports = { addBid, hireFreelancer, getBids };