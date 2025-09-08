const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  module: { type: String, required: true },
  topics: [{ type: String }],
  duration: { type: String }
});

const certificateSchema = new mongoose.Schema({
  image: { type: String },
  criteria: [{ type: String }]
});

const courseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  icon: { type: String },
  courses: [{
    courseCode: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String },
    banner: { type: String },
    details: { type: String },
    description: { type: String },
    preview: { type: String },
    skills: [{ type: String }],
    eligibility: [{ type: String }],
    duration: { type: String },
    students: { type: Number, default: 0 },
    fees: {
      original: { type: Number },
      discounted: { type: Number },
      currency: { type: String, default: "Rs." }
    },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    instructor: { type: String },
    syllabus: [syllabusSchema],
    benefits: [{ type: String }],
    certificate: certificateSchema,
    features: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Course', courseSchema);