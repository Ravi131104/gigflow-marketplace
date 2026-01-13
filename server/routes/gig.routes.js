const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const { createGig, getGigs, getGig } = require("../controllers/gigController");

const router = express.Router();

// PROTECTED: Only logged in users can create a gig
router.post("/", verifyToken, createGig);

// PUBLIC: Anyone can view gigs
router.get("/", getGigs);
router.get("/:id", getGig);

module.exports = router;