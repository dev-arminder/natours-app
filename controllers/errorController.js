const AppError = require('../utils/appError');
//hanlde cast error database
const handleCaseErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};

//In Case of Duplicate Name
const handleDuplicateErrorDB = err => {
  const message = 'Name Already Exist';
  return new AppError(message, 400);
};

//Handle Mongoose Validation Error
const handleValidationErrorDB = err => {
  const errors = Object.values(err.error).map(err => err.message);
  const message = `Invalid Input Data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });
};

const sendErrorProduction = (err, res) => {
  //Error By devolpers
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    //Third Party Error - Programming or any other
    console.error('Error', err);
    res.status(500).json({
      status: 'error',
      message: 'Something Went Very Wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    //Casting Error - incase of wrong ID
    if (error.name === 'CastError') error = handleCaseErrorDB(error);

    //Dulication Error - in Case of name already Exist
    if (error.code === 11000) error = handleDuplicateErrorDB(error);

    //Mongoose Validation Error
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProduction(error, res);
  }
};
