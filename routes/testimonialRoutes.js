const express = require('express');
const router = express.Router();
const { protect, adminMiddleware } = require('../middlewares/authMiddleware');
const {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');

console.log({ getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial }); // just to check

// Public routes
router.get('/', getTestimonials);

// Protected admin routes
router.post('/', protect, adminMiddleware, addTestimonial);
router.put('/:id', protect, adminMiddleware, updateTestimonial);
router.delete('/:id', protect, adminMiddleware, deleteTestimonial);

module.exports = router;
