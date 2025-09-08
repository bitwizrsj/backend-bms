const Course = require('../models/Course');
const { parser } = require('../utils/cloudinary');
const { cloudinary } = require('../utils/cloudinary');

// @desc    Get all courses
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single course by courseCode
// @route   GET /api/courses/:courseCode
const getCourseByCode = async (req, res) => {
  try {
    const course = await Course.findOne({ 'courses.courseCode': req.params.courseCode });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const courseData = course.courses.find(c => c.courseCode === req.params.courseCode);
    res.json({ category: course.category, ...courseData.toObject() });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create new course category or add course to existing category
// @route   POST /api/courses
const createCourse = async (req, res) => {
  try {
    const { category, ...courseData } = req.body;
    
    let courseCategory = await Course.findOne({ category });
    
    if (!courseCategory) {
      courseCategory = new Course({ 
        category,
        courses: [courseData]
      });
    } else {
      courseCategory.courses.push(courseData);
    }
    
    await courseCategory.save();
    res.status(201).json(courseCategory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Upload course image
// @route   POST /api/courses/upload
// Backend Controller
const uploadImage = (req, res) => {
  console.log('Inside uploadImage, req.file:', req.file);
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({
    url: req.file.path,
    public_id: req.file.filename,
  });
};





// @desc    Delete a course
// @route   DELETE /api/courses/:courseCode
const deleteCourse = async (req, res) => {
  try {
    const result = await Course.updateOne(
      { 'courses.courseCode': req.params.courseCode },
      { $pull: { courses: { courseCode: req.params.courseCode } } }
    );
    
    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({ message: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a course by courseCode
// @route   PUT /api/courses/:courseCode
const updateCourse = async (req, res) => {
  try {
    const oldCourseCode = req.params.courseCode;
    const updateData = req.body;

    const courseCategory = await Course.findOne({ 'courses.courseCode': oldCourseCode });

    if (!courseCategory) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const courseIndex = courseCategory.courses.findIndex(course => course.courseCode === oldCourseCode);

    if (courseIndex === -1) {
      return res.status(404).json({ message: 'Course not found in category' });
    }

    // Update the course data (including courseCode)
    courseCategory.courses[courseIndex] = {
      ...courseCategory.courses[courseIndex]._doc,
      ...updateData,
    };

    await courseCategory.save();

    res.json({
      message: 'Course updated successfully',
      updatedCourseCode: courseCategory.courses[courseIndex].courseCode,
      course: courseCategory.courses[courseIndex],
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



module.exports = {
  getCourses,
  getCourseByCode,
  createCourse,
  uploadImage,
  deleteCourse,
  updateCourse,
  uploadMiddleware: parser.single('image')
};