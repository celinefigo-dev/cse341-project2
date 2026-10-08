const express = require('express');
const router = express.Router();

const toursController = require('../controllers/tours');
const { isAuthenticated } = require('../middleware/auth');

// Anyone can view tours //
router.get('/', toursController.getAllTours);
router.get('/:id', toursController.getSingleTour);

// Logged-in users only //
router.post('/', isAuthenticated, toursController.createTour);
router.put('/:id', isAuthenticated, toursController.updateTour);
router.delete('/:id', isAuthenticated, toursController.deleteTour);

// #swagger.start //
module.exports = router;