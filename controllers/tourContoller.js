const TourModel = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
//Catch Async Errors
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
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
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await TourModel.findById(req.params.id);

  //If NO tour Found
  if (!tour) {
    return next(new AppError('No Tour Found With that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
});

exports.postTour = catchAsync(async (req, res, next) => {
  const tour = await TourModel.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
});

exports.patchTour = catchAsync(async (req, res, next) => {
  const tour = await TourModel.findById(req.params.id);
  //If NO tour Found
  if (!tour) {
    return next(new AppError('No Tour Found With that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await TourModel.findByIdAndDelete(req.params.id);
  //If NO tour Found
  if (!tour) {
    return next(new AppError('No Tour Found With that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: {
      message: 'Data deleted'
    }
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await TourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);
  console.log(stats);
  res.status(200).json({
    status: 'success',
    data: {
      stats: stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await TourModel.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: {
          $month: '$startDates'
        },
        numTourStats: { $sum: 1 },
        tours: {
          $push: '$name'
        }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numTourStats: -1
      }
    },
    {
      $limit: 12
    }
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      plan
    }
  });
});
