const express = require('express');
const router = express.Router();

const tourController = require('./../controllers/tourContoller');

//param middleware - run this middleware for specific param - id
// router.param('id', tourController.checkId);

router.get('/', tourController.getAllTours);

//5 Best and cheapest Tour - using alising
router.get(
  '/top-5-cheap',
  tourController.aliasTopTour,
  tourController.getAllTours
);

router.get('/:id', tourController.getTour);

router.post('/', tourController.postTour);

router.patch('/:id', tourController.patchTour);

router.delete('/:id', tourController.deleteTour);

module.exports = router;
