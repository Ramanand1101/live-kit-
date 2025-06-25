const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: String,
  startDate: Date,
  studentList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isApprovedByAdmin: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  isInactive: { type: Boolean, default: false },
});

module.exports = mongoose.model('Course', CourseSchema);
