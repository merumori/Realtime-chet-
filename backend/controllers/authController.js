const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  await newUser.save();
  res.status(201).json(newUser);
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) return res.json(user);
  res.status(401).json({ message: 'Invalid credentials' });
};

exports.getAllUsers = async (req, res) => {
  const { userId } = req.params;
  const users = await User.find({ _id: { $ne: userId } });
  res.json(users);
};
