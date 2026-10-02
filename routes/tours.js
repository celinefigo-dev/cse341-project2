const express = require('express');
const router = express.Router();

const toursController = require('../controllers/tours');

// GET all tours
router.get('/', toursController.getAllTours);

// GET one tour
router.get('/:id', toursController.getSingleTour);

// CREATE tour
router.post('/', toursController.createTour);

// UPDATE tour
router.put('/:id', toursController.updateTour);

// DELETE tour
router.delete('/:id', toursController.deleteTour);

module.exports = router;