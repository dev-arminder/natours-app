const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users
    }
  });
});

exports.postUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is route is not yet implemented'
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is route is not yet implemented'
  });
};

exports.patchUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is route is not yet implemented'
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This is route is not yet implemented'
  });
};
