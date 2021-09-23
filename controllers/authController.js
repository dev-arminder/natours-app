const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
//Catch Async Errors
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm
  });

  //Auth User using jwt
  //jwt.sign(payload, secret, )
  //Creating a token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'Success',
    token: token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //. If email and password actually exist
  // Checek If user exist and password is correct
  // If everything ok, Send token to CLient

  if (!email || !password) {
    return next(new AppError('Please Provide Email and Passwors', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  const correct = user.correctPassword(password, user.password);
  console.log(correct);

  const token = '';
  res.status(200).send({
    status: 'success',
    token
  });
});
