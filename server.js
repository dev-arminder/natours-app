const mongoose = require('mongoose');
const app = require('./app');

//Connection with ATLAS
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log('database connected Sucessfully');
  })
  .catch(e => {
    console.log('Some Error While Connecting to Database');
    console.log(e);
  });

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});

//Handling UNHandle Error Message { Wrong Password For MongoDB DataBAse } - Globally with Error Events
//
process.on('uncaughtException', err => {
  console.log('Unhadle Rejection * Shutting Down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
