const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  text: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  isFeatured: { type: Boolean, default: false }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);