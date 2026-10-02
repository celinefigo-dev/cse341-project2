const express = require('express');
const router = express.Router();

const bookingsController = require('../controllers/bookings');

router.get('/', bookingsController.getAllBookings);

router.get('/:id', bookingsController.getSingleBooking);

router.post('/', bookingsController.createBooking);

router.put('/:id', bookingsController.updateBooking);

router.delete('/:id', bookingsController.deleteBooking);

module.exports = router;