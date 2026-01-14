const Bid = require("../models/bid");
const Gig = require("../models/gig");
// ✅ NEW IMPORTS: Required for the automatic message feature
const Conversation = require("../models/conversation"); 
const Message = require("../models/message");

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
      status: 'pending' 
    });

    await newBid.save();
    res.status(201).json(newBid);
  } catch (err) {
    next(err);
  }
};

// 2. HIRE FREELANCER (Updated with Messaging)
const hireFreelancer = async (req, res, next) => {
  const { bidId } = req.params;
  const { gigId } = req.body; 
  const employerId = req.userId; // We need the Employer's ID to send the message

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
      { status: 'hired' },
      { new: true }
    );

    // C. REJECT OTHERS
    await Bid.updateMany(
      { gigId: gigId, _id: { $ne: bidId } }, 
      { status: 'rejected' }
    );

    // --- D. SEND AUTOMATIC CONGRATULATIONS MESSAGE ---
    try {
      const freelancerId = winningBid.freelancerId.toString();
      
      // 1. Generate Unique Conversation ID (Standard: sellerId + buyerId)
      // Note: Ensure this ID generation logic matches your conversation.controller.js logic
      // Usually, it is safe to sort them to ensure uniqueness regardless of who initiated.
      // Or, we follow your app's convention (Seller + Buyer).
      // Assuming Freelancer = Seller, Employer = Buyer
      const conversationId = freelancerId + employerId; 

      // 2. Create or Update the Conversation
      await Conversation.findOneAndUpdate(
        { id: conversationId },
        {
          $set: {
            id: conversationId,
            sellerId: freelancerId,
            buyerId: employerId,
            readBySeller: false, // Mark unread for freelancer
            readByBuyer: true,
            lastMessage: `🎉 YOU'RE HIRED: ${gig.title}`,
          },
        },
        { upsert: true, new: true }
      );

      // 3. Create the Message Object
      const newMessage = new Message({
        conversationId: conversationId,
        userId: employerId, // Message is FROM the Employer
        desc: `🎉 Congratulations! I have accepted your proposal for "${gig.title}". Let's get started!`,
      });
      
      await newMessage.save();

    } catch (msgErr) {
      console.log("Auto-message failed (non-critical):", msgErr);
      // We log the error but do NOT fail the hiring request.
    }
    // ---------------------------------------------------

    res.status(200).json({ message: "Freelancer hired & notified!", winningBid });
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