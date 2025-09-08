const Testimonial = require('../models/Testimonial');

// @desc    Get all testimonials
// @route   GET /api/testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add new testimonial
// @route   POST /api/testimonials
const addTestimonial = async (req, res) => {
  const { text, name, role, rating, isFeatured } = req.body;

  try {
    const newTestimonial = new Testimonial({
      text,
      name,
      role,
      rating,
      isFeatured: isFeatured || false
    });

    const testimonial = await newTestimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
const updateTestimonial = async (req, res) => {
  const { text, name, role, rating, isFeatured } = req.body;

  try {
    let testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ msg: 'Testimonial not found' });
    }

    testimonial.text = text || testimonial.text;
    testimonial.name = name || testimonial.name;
    testimonial.role = role || testimonial.role;
    testimonial.rating = rating || testimonial.rating;
    testimonial.isFeatured = isFeatured ?? testimonial.isFeatured;

    await testimonial.save();
    res.json(testimonial);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ msg: 'Testimonial not found' });
    }

    await testimonial.remove();
    res.json({ msg: 'Testimonial removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial
};
