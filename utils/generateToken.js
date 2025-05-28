const { AccessToken } = require('livekit-server-sdk');
const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;

function generateRecorderToken() {
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: "recorder-" + Date.now(),
    ttl: 3600,
  });
  token.addGrant({ roomRecord: true });
  return token.toJwt();
}

function generateUserToken(identity, roomName, isPublisher = true) {
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, { identity });
  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: !!isPublisher,
    canSubscribe: true,
  });
  return token.toJwt();
}

module.exports = { generateRecorderToken, generateUserToken };
