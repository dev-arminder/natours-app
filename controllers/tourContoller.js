const TourModel = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(TourModel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours
      }
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await TourModel.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err
    });
  }
};

exports.postTour = async (req, res) => {
  try {
    let body = req.body;
    const tour = await TourModel.create({
      name: body.name,
      duration: body.duration,
      maxGroupSize: body.maxGroupSize,
      difficulty: body.difficulty,
      ratingsAverage: body.ratingsAverage,
      ratingsQuantity: body.ratingsQuantity,
      price: body.price,
      summary: body.summary,
      description: body.description,
      imageCover: body.imageCover,
      images: body.images,
      startDates: body.startDates,
      price: body.price
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    });
  }
};

exports.patchTour = async (req, res) => {
  try {
    const tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (err) {}
};

exports.deleteTour = async (req, res) => {
  try {
    await TourModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        message: 'Data deleted'
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'Failed',
      message: err
    });
  }
};