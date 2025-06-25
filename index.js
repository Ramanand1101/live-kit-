const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const tokenRoutes = require('./routes/tokenRoutes');
const recordingRoutes = require('./routes/recordingRoutes');
const courseRoutes = require('./routes/courseRoutes');        // NEW
const cronRoutes = require('./routes/cronRoutes');            // NEW
const connectDB = require('./config/db');                     // NEW

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB (if needed)
connectDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://meet.lcmgo.com",
    "https://live-kit-frontend.vercel.app",
    "https://live-kit-frontend.onrender.com",
    "https://live-kit-frontend-tfdm.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api", tokenRoutes);
app.use("/api", recordingRoutes);
app.use("/api/courses", courseRoutes);    // NEW
app.use("/api/cron", cronRoutes);         // NEW

// Root Test Route
app.get("/", (req, res) => {
  res.send("✅ LiveKit token + recording + course server (MVC) is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
