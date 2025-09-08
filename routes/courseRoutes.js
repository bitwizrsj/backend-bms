const express = require('express');
const router = express.Router();
const { protect, adminMiddleware } = require('../middlewares/authMiddleware');
const {
  getCourses,
  getCourseByCode,
  createCourse,
  uploadImage,
  deleteCourse,
  uploadMiddleware,
  updateCourse
} = require('../controllers/courseController');
const { parser } = require('../utils/cloudinary');

// Public routes
router.get('/', getCourses);
router.get('/:courseCode', getCourseByCode);

// Protected routes (admin only)
router.post('/', protect, adminMiddleware, createCourse);
router.post('/upload', protect, adminMiddleware, parser.single('image'), (req, res, next) => {
  console.log('Upload route hit');
  next();
}, uploadImage);
router.put('/:courseCode', protect, adminMiddleware, updateCourse);

router.delete('/:courseCode', protect, adminMiddleware, deleteCourse);

module.exports = router;