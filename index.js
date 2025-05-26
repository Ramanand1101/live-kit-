const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { AccessToken } = require('livekit-server-sdk');

dotenv.config();

const app = express();

// CORS Middleware
app.use(cors({
  origin: ["http://localhost:3000","https://meet.lcmgo.com","https://live-kit-frontend.vercel.app","https://live-kit-frontend.onrender.com"
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

// Environment Variables
const {
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET,
  LIVEKIT_URL,
  PORT = 3001,
} = process.env;

// Root Endpoint
app.get("/", (req, res) => {
  res.send("✅ LiveKit token server running!");
});

// Token Generation Endpoint
app.post('/get-token', async (req, res) => {
  const { identity, roomName, isPublisher = true } = req.body;

  if (!identity || !roomName) {
    return res.status(400).json({ error: 'Missing identity or roomName' });
  }

  if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
    return res.status(500).json({ error: 'Server misconfiguration: missing API credentials' });
  }

  try {
    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, { identity });

    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: !!isPublisher,
      canSubscribe: true,
    });

    const jwt = await token.toJwt();

    console.log(`✅ Token generated for ${identity} in room "${roomName}"`);
    res.json({ token: jwt, wsUrl: LIVEKIT_URL });

  } catch (err) {
    console.error('❌ Token generation failed:', err);
    res.status(500).json({ error: 'Token generation failed' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Token server running at http://localhost:${PORT}`);
});
