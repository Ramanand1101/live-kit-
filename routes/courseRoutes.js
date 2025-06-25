const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Create a new course
router.post('/', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/bulk-insert', async (req, res) => {
  try {
    const result = await Course.insertMany(req.body);
    res.status(201).json({ message: 'Courses inserted successfully', insertedCount: result.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
