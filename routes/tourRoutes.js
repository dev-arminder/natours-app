const express = require('express');
const router = express.Router();

const tourController = require('./../controllers/tourContoller');
const authController = require('./../controllers/authController');

//param middleware - run this middleware for specific param - id
// router.param('id', tourController.checkId);

router.get('/', authController.protect, tourController.getAllTours);

//5 Best and cheapest Tour - using alising
router.get(
  '/top-5-cheap',
  tourController.aliasTopTour,
  tourController.getAllTours
);

router.get('/tour-stats', tourController.getTourStats);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router.get('/:id', tourController.getTour);

router.post('/', tourController.postTour);

router.patch('/:id', tourController.patchTour);

router.delete(
  '/:id',
  authController.protect,
  authController.restricitTo('admin', 'lead-guide'),
  tourController.deleteTour
);

module.exports = router;
