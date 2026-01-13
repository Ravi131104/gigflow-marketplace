const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
// IMPORT MUST MATCH EXPORTS EXACTLY
const { addBid, getBids, hireFreelancer } = require("../controllers/bidController");

const router = express.Router();

// Route to create a bid (Protected)
router.post("/", verifyToken, addBid);

// Route to get all bids for a specific gig
router.get("/:gigId", verifyToken, getBids);

// Route to hire a freelancer (Protected)
router.patch("/:bidId/hire", verifyToken, hireFreelancer);

module.exports = router;