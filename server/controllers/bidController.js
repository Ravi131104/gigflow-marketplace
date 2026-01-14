const Bid = require("../models/bid");
const Gig = require("../models/gig");

// 1. ADD BID
const addBid = async (req, res, next) => {
  try {
    const { gigId, price, message } = req.body;
    const freelancerId = req.userId;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json("Gig not found!");

    if (gig.userId === freelancerId) {
      return res.status(403).json("You cannot bid on your own gig!");
    }

    const existingBid = await Bid.findOne({ gigId, freelancerId });
    if (existingBid) {
      return res.status(409).json("You have already placed a bid on this gig.");
    }

    const newBid = new Bid({
      gigId,
      freelancerId,
      price,
      message,
      status: 'Pending'
    });

    await newBid.save();
    res.status(201).json(newBid);
  } catch (err) {
    next(err);
  }
};

// 2. HIRE FREELANCER
const hireFreelancer = async (req, res, next) => {
  const { bidId } = req.params; // Matches the route parameter /:bidId/hire
  const { gigId } = req.body; 

  try {
    // A. LOCK GIG
    const gig = await Gig.findOneAndUpdate(
      { _id: gigId, status: "Open" }, 
      { $set: { status: "Assigned" } }, 
      { new: true }
    );

    if (!gig) {
      return res.status(400).json("This gig is already assigned or closed!");
    }

    // B. UPDATE WINNING BID
    const winningBid = await Bid.findByIdAndUpdate(
      bidId,
      { status: 'Hired' },
      { new: true }
    );

    // C. REJECT OTHERS
    await Bid.updateMany(
      { gigId: gigId, _id: { $ne: bidId } }, 
      { status: 'Rejected' }
    );

    res.status(200).json({ message: "Freelancer hired successfully!", winningBid });
  } catch (err) {
    next(err);
  }
};

// 3. GET BIDS
const getBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate("freelancerId", "name email"); 
    res.status(200).json(bids);
  } catch (err) {
    next(err);
  }
};

module.exports = { addBid, hireFreelancer, getBids };