const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { AccessToken } = require('livekit-server-sdk');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());
//done
// Environment variables
const {
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET,
  LIVEKIT_URL,
  PORT = 3001,
} = process.env;

// Root route
app.get("/", (req, res) => {
  res.send("✅ LiveKit token server running!");
});

// Token route
app.post('/get-token', async (req, res) => {
  const { identity, roomName, isPublisher } = req.body;

  if (!identity || !roomName) {
    return res.status(400).json({ error: 'Missing identity or roomName' });
  }

  try {
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity,
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: !!isPublisher,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    console.log("✅ Token generated for", identity, "in room", roomName);
    res.json({ token, wsUrl: LIVEKIT_URL });

  } catch (err) {
    console.error('❌ Token generation failed:', err);
    res.status(500).json({ error: 'Token generation failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Token server listening at http://localhost:${PORT}`);
});
