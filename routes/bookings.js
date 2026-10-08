const express = require('express');
const router = express.Router();

const bookingsController = require('../controllers/bookings');
const { isAuthenticated } = require('../middleware/auth');

// Public routes
router.get('/', bookingsController.getAllBookings);
router.get('/:id', bookingsController.getSingleBooking);

// Protected routes - login required
router.post('/', isAuthenticated, bookingsController.createBooking);
router.put('/:id', isAuthenticated, bookingsController.updateBooking);
router.delete('/:id', isAuthenticated, bookingsController.deleteBooking);

module.exports = router;