const { generateUserToken } = require('../utils/generateToken');
const { LIVEKIT_URL } = process.env;

exports.getToken = async (req, res) => {
  const { identity, roomName, isPublisher = true } = req.body;

  if (!identity || !roomName) {
    return res.status(400).json({ error: 'Missing identity or roomName' });
  }

  try {
    const jwt = await generateUserToken(identity, roomName, isPublisher);
    res.json({ token: jwt, wsUrl: LIVEKIT_URL });
  } catch (err) {
    console.error("Token generation error:", err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
};
