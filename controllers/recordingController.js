const axios = require('axios');
const { generateRecorderToken } = require('../utils/generateToken');
const { LIVEKIT_URL } = process.env;
console.log("LIVEKIT_URL:", LIVEKIT_URL);

exports.startRecording = async (req, res) => {
  const { roomName } = req.body;
  if (!roomName) return res.status(400).json({ error: "roomName is required" });

  try {
    const token = generateRecorderToken();

    const response = await axios.post(
      `${LIVEKIT_URL}/recording/start`,
      {
        input: { room_name: roomName, layout: "grid" },
        output: {
          type: "file",
          file: { path: `recordings/${roomName}-${Date.now()}.mp4` },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "Recording started",
      recordingId: response.data.recording_id,
      data: response.data,
    });
  } catch (err) {
    console.error("Start recording failed:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to start recording" });
  }
};

exports.endRecording = async (req, res) => {
  const { recordingId } = req.body;
  if (!recordingId) return res.status(400).json({ error: "recordingId is required" });

  try {
    const token = generateRecorderToken();

    const response = await axios.post(
      `${LIVEKIT_URL}/recording/end`,
      { recording_id: recordingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "Recording ended",
      data: response.data,
    });
  } catch (err) {
    console.error("End recording failed:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to end recording" });
  }
};
