const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
//Routes
const tourRoutes = require('./routes/tourRoutes');
const userRotes = require('./routes/userRoutes');
//intializing app

//Uncaught Exception
process.on('uncaughtException', err => {
  console.log('Uncaught Exception * Shutting Down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

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
  next(new AppError(`Can't Find ${req.originalUrl} on this server`, 404));
});

//GLobal Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
