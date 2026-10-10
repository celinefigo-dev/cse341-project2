
const express = require('express');
const router = express.Router();

const toursController = require('../controllers/tours');
const { isAuthenticated } = require('../middleware/auth');

// Public routes - anyone can view tours
router.get('/', toursController.getAllTours);
router.get('/:id', toursController.getSingleTour);

// Protected routes - login required
router.post('/', isAuthenticated, toursController.createTour);
router.put('/:id', isAuthenticated, toursController.updateTour);
router.delete('/:id', isAuthenticated, toursController.deleteTour);

module.exports = router;
