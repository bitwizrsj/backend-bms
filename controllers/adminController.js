const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// Register
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const adminExists = await Admin.findOne({ email });
  if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

  const admin = await Admin.create({ name, email, password });
  res.status(201).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    token: generateToken(admin._id),
  });
};

// Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Profile (Protected)
exports.getProfile = async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select('-password');
  if (admin) res.json(admin);
  else res.status(404).json({ message: 'Admin not found' });
};
