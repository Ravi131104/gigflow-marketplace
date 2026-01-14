const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // 1. EXTRACT TOKEN (From Cookie OR Header)
  // Check cookie first
  let token = req.cookies.accessToken;

  // If no cookie, check the Authorization header (Format: "Bearer <token>")
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. CHECK IF TOKEN EXISTS
  if (!token) return res.status(401).send("You are not authenticated!");

  // 3. VERIFY TOKEN
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(403).send("Token is not valid!");
    
    // Handle 'id' vs '_id' payload versions
    req.userId = payload.id || payload._id;
    req.isSeller = payload.isSeller; // (Optional: useful if you use this later)
    
    // Safety Check
    if (!req.userId) {
        console.log("ERROR: Token payload is missing ID!", payload);
        return res.status(403).send("Token payload is invalid.");
    }

    next();
  });
};

module.exports = { verifyToken };