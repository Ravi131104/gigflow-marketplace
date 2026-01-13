const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// 1. Import HTTP and Socket.io
const http = require("http");
const { Server } = require("socket.io");

// Import Routes
const authRoutes = require('./routes/auth.routes');
const gigRoutes = require('./routes/gig.routes');
const bidRoutes = require('./routes/bid.routes');

const app = express();
dotenv.config();

// 2. Create HTTP Server & Socket.io Instance
const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:5173",
  "https://gigflow-marketplace.vercel.app",
  "https://gigflow-marketplace-liard.vercel.app" // <--- PASTE YOUR VERCEL LINK HERE
];
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // URL of your React Client
    methods: ["GET", "POST", "PATCH"],
    credentials: true, // Allow cookies to be sent
  },
});

// ... imports ...

// 3. SOCKET CONNECTION LOGIC
let onlineUsers = []; 

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id); // DEBUG LOG

  socket.on("addNewUser", (userId) => {
    // Check if user already exists
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
    console.log("Online Users Updated:", onlineUsers); // DEBUG LOG
    
    // CRITICAL: Update the global variable so Controllers see the changes
    app.set('onlineUsers', onlineUsers);
  });

  socket.on("disconnect", () => {
    // FIX: Use filter, but then IMMEDIATELY update the app setting
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    app.set('onlineUsers', onlineUsers); // <--- THIS LINE WAS MISSING
    
    console.log("User disconnected. Remaining:", onlineUsers);
  });
});

// 4. Make Socket.io accessible globally (so Controllers can use it)
app.set('socketio', io);
app.set('onlineUsers', onlineUsers);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Database Connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log(error);
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

// Error Handling
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// 5. Change 'app.listen' to 'server.listen'
server.listen(8800, () => {
  connect();
  console.log("Backend server & Socket.io running on port 8800!");
});