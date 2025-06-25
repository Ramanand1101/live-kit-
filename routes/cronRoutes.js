const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const dayjs = require('dayjs');

// 📌 Create a new course
router.post('/', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    console.log(`✅ Course created: ${course.title}`);
    res.json({ success: true, course });
  } catch (error) {
    console.error("❌ Error creating course:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📌 Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    console.log(`📦 Fetched ${courses.length} courses`);
    res.json({ success: true, courses });
  } catch (error) {
    console.error("❌ Error fetching courses:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/check-inactive', async (req, res) => {
  try {
    const now = new Date();

    const courses = await Course.find({
      startDate: { $lte: now },
      $or: [{ studentList: { $size: 0 } }, { studentList: { $exists: false } }],
      isApprovedByAdmin: true,
      isVisible: true
    });

    console.log(`🔍 Found ${courses.length} inactive courses`);

    if (courses.length === 0) {
      return res.json({ success: true, message: 'No action needed.' });
    }

    let updatedCount = 0;

    for (let course of courses) {
      const newStartDate = dayjs(now).add(7, 'day').toDate();

      const updated = await Course.findByIdAndUpdate(course._id, {
        startDate: newStartDate,
        isVisible: false
      }, { new: true });

      if (updated) {
        updatedCount++;
        console.log(`🔁 ${updated.title} updated → ${dayjs(updated.startDate).format('DD MMM YYYY')}`);
      } else {
        console.log(`⚠️ Failed to update course: ${course.title}`);
      }
    }

    res.json({ success: true, updated: updatedCount });

  } catch (error) {
    console.error("❌ Cron error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;
