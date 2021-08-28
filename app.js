const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');

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

//Routes
const tourRoutes = require('./routes/tourRoutes');
const userRotes = require('./routes/userRoutes');

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRotes);

module.exports = app;
