const express = require("express");
// FIX: Import from 'jwt.js' where we defined the verifyToken function earlier
const { verifyToken } = require("../middleware/verifyToken"); 
const { addBid, getBids, hireFreelancer } = require("../controllers/bidcontroller");

const router = express.Router();

// 1. Create a bid
router.post("/", verifyToken, addBid);

// 2. Get all bids for a specific gig
router.get("/:gigId", verifyToken, getBids);

// 3. Hire a freelancer
// This matches the controller: expects 'bidId' in params
router.put("/hire/:bidId", verifyToken, hireFreelancer); 

module.exports = router;