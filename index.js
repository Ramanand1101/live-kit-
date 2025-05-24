const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { AccessToken } = require('livekit-server-sdk');

dotenv.config();
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://live-kit-frontend.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

const {
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET,
  PORT = 3001,
} = process.env;

app.get("/",(req,res)=>{
    res.send("Live-kit server working")
})

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

    // ✅ FIX: Await the async call
    const token = await at.toJwt();

    console.log("✅ Generated token:", token);
    res.json({ token });

  } catch (err) {
    console.error('❌ Token generation failed:', err);
    res.status(500).json({ error: 'Token generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Token server running at http://localhost:${PORT}`);
});
