const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

//Creating a Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A tour name must have less than or equal than 40 character'
      ],
      minLength: [5, 'A tour must have more or equal than 10 character']
      // validate: [validator.isAlpha, 'Tour Name must only be contain character']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group Size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour should have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficult is either easy, medium, difficulty'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating Must be above 1'],
      max: [5, 'Rating Must be Below 5']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //this only poits to doucment create of doc not of update
          return val < this.price;
        },
        message: 'Discount Price ({VALUE}) should be below regular Price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour Must have a cover Image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },

  {
    toJSON: {
      virtuals: true
    }
  }
);

//Virtual Property to save data on web
tourSchema.virtual('durationWeeks').get(function() {
  return (this.duration / 7).toFixed(2);
});

//Document Middleware: runs before .save() abd .create()
// tourSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//Query Middleware : runs before each query
// tourSchema.pre('find', function(query, next) {
//   next();
// });

// //aggregation middleware
// tourSchema.pre('aggregate', function(next){
//   console.log(this);
// next();
// })

//Creating A Tour Model
const TourModel = mongoose.model('TourModel', tourSchema);

module.exports = TourModel;
