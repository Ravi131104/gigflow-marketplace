const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).send("You are not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(403).send("Token is not valid!");
    
    // FIX: Check for 'id' OR '_id' to handle different token versions
    req.userId = payload.id || payload._id;
    
    // Debugging: Print ID to terminal to ensure it exists
    if (!req.userId) {
        console.log("ERROR: Token payload is missing ID!", payload);
        return res.status(403).send("Token payload is invalid.");
    }

    next();
  });
};

module.exports = { verifyToken };