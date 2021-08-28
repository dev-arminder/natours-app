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

// const testTour = new TourModel({
//   name: 'The Forest hiker',
//   rating: 4.7,
//   price: 497
// });
// testTour.save();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});
