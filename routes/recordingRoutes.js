const express = require('express');
const router = express.Router();
const {
  startRecording,
  endRecording,
} = require('../controllers/recordingController');

router.post('/start-recording', startRecording);
router.post('/end-recording', endRecording);

module.exports = router;
