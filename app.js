const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');

//Routes
const tourRoutes = require('./routes/tourRoutes');
const userRotes = require('./routes/userRoutes');
//intializing app
const app = express();

//configuring dotenv
dotenv.config({ path: './config.env' });

//Logging Request
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

//middleware to parse body request
app.use(express.json());
//serving static Files
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRotes);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Can't Find ${req.originalUrl} on this server`
  // });
  // const err = new Error(`Can't Find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't Find ${req.originalUrl} on this server`, 404));
});

//GLobal Error Handling Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
