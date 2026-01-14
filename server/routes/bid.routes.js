const express = require("express");
const { verifyToken } = require("../middleware/verifyToken"); 

// IMPORTANT: Ensure this filename matches your actual file.
// If your file is named "bid.controller.js", change this require to "../controllers/bid.controller"
const { addBid, getBids, hireFreelancer } = require("../controllers/bidController");

const router = express.Router();

// 1. Create a bid
router.post("/", verifyToken, addBid);

// 2. Get all bids for a specific gig
router.get("/:gigId", verifyToken, getBids);

// 3. Hire a freelancer (FIXED)
// Changed from .put to .patch to match your Dashboard.jsx
router.patch("/:bidId/hire", verifyToken, hireFreelancer); 

module.exports = router;