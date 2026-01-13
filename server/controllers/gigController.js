const Gig = require("../models/gig");

const createGig = async (req, res, next) => {
  try {
    // 1. Check if user is authenticated (req.userId comes from verifyToken)
    if (!req.userId) return res.status(401).json("Not authenticated!");

    // 2. Create new Gig with the ownerId attached
    const newGig = new Gig({
      ...req.body,       // Title, Description, Budget from the form
      ownerId: req.userId, // LINK THE GIG TO THE USER
    });

    // 3. Save to DB
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
    
  } catch (err) {
    next(err);
  }
};

const getGigs = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  try {
    const gigs = await Gig.find(filters).populate("ownerId", "name email");
    res.status(200).json(gigs);
  } catch (err) {
    next(err);
  }
};

const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("ownerId", "name email");
    if (!gig) return res.status(404).json("Gig not found!");
    res.status(200).json(gig);
  } catch (err) {
    next(err);
  }
};

module.exports = { createGig, getGigs, getGig };
