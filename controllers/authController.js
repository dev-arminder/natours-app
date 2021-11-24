const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
//Catch Async Errors
const catchAsync = require('../utils/catchAsync');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

//signUp Functionality
exports.signup = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt
  } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt
  });

  //Auth User using jwt
  //jwt.sign(payload, secret, )
  //Creating a token
  //sign token function defiend above
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'Success',
    token: token,
    data: {
      user: newUser
    }
  });
});

// Login Functionality
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //. If email and password actually exist
  // Checek If user exist and password is correct
  // If everything ok, Send token to CLient

  if (!email || !password) {
    return next(new AppError('Please Provide Email and Passwors', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Passwors', 401));
  }
  const token = signToken(user._id);

  res.status(200).send({
    status: 'success',
    token
  });
});

// Protected Route Middleware
exports.protect = catchAsync(async (req, res, next) => {
  // 1.) Get the token and check if it's there
  // 2.) Validate token - Important Stuff
  // 3.) Check if user still exist
  // 4.) Check if user changed Password after jwt was issued
  // 5.) After all this next gonna be call
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not LoggedIn'), 401);
  }

  //veriy Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if User still exist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return new AppError("The User blong to this token Doesn't exist", 401);
  }
  //Check if user changes Password After token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently Changed Password, Please Login Again', 401)
    );
  }

  // Grant access To protectd Routes
  req.user = currentUser;
  next();
});

exports.restricitTo = (...roles) => {
  return (req, res, next) => {
    //roles is in array - of roles
    //Application of Clouser Function - Function returned by function
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You dont have permission to perform this action', 403)
      );
    }

    next();
  };
};

// When User forget  His Password
exports.forgetPassword = catchAsync(async (req, res, next) => {
  // Steps
  //Get the uSer Based Upon their Email
  //Generate the random reset Token
  //Send it back as an email

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email Adddress', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const messgae = `Forget Your Password ? Submit a Patch Request wuth your new password and password confirm to : ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password Reset token for 10 Minutes',
      messgae: messgae
    });
    res.status(200).json({
      status: 'success',
      messgae: 'Token Sent to Email'
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There Was an error sending Email, Try again later')
    );
  }
});

exports.resetPassword = (req, res, next) => {};
