
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// Validate booking information
const validateBooking = (booking) => {
  const {
    customerName,
    email,
    tourId,
    bookingDate,
    numberOfPeople,
    totalPrice,
    status
  } = booking;

  // Check required fields
  if (
    customerName === undefined ||
    email === undefined ||
    tourId === undefined ||
    bookingDate === undefined ||
    numberOfPeople === undefined ||
    totalPrice === undefined ||
    status === undefined
  ) {
    return 'All booking fields are required';
  }

  // Validate text fields
  const textFields = [
    customerName,
    email,
    tourId,
    bookingDate,
    status
  ];

  if (
    textFields.some(
      (value) =>
        typeof value !== 'string' ||
        value.trim() === ''
    )
  ) {
    return 'All text fields must contain valid text';
  }

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address';
  }

  // Validate tour ID
  if (!ObjectId.isValid(tourId)) {
    return 'Invalid tour ID';
  }

  // Validate booking date (YYYY-MM-DD)
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(bookingDate)) {
    return 'Booking date must be in YYYY-MM-DD format';
  }

  const parsedDate = new Date(
    `${bookingDate}T00:00:00.000Z`
  );

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== bookingDate
  ) {
    return 'Please enter a valid booking date';
  }

  // Validate number of people
  if (
    !Number.isInteger(numberOfPeople) ||
    numberOfPeople < 1
  ) {
    return 'numberOfPeople must be a positive whole number';
  }

  // Validate total price
  if (
    typeof totalPrice !== 'number' ||
    !Number.isFinite(totalPrice) ||
    totalPrice < 0
  ) {
    return 'totalPrice must be a valid number';
  }

  return null;
};

// GET all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await getDb()
      .collection('bookings')
      .find()
      .toArray();

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error retrieving bookings:', error);

    return res.status(500).json({
      message: 'Error retrieving bookings'
    });
  }
};

// GET one booking by ID
const getSingleBooking = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid booking ID'
      });
    }

    const booking = await getDb()
      .collection('bookings')
      .findOne({
        _id: new ObjectId(req.params.id)
      });

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error('Error retrieving booking:', error);

    return res.status(500).json({
      message: 'Error retrieving booking'
    });
  }
};

// POST create a booking
const createBooking = async (req, res) => {
  try {
    const errorMessage = validateBooking(req.body || {});

    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      });
    }

    const {
      customerName,
      email,
      tourId,
      bookingDate,
      numberOfPeople,
      totalPrice,
      status
    } = req.body;

    const booking = {
      customerName,
      email,
      tourId,
      bookingDate,
      numberOfPeople,
      totalPrice,
      status
    };

    const response = await getDb()
      .collection('bookings')
      .insertOne(booking);

    if (!response.acknowledged) {
      return res.status(500).json({
        message: 'Error creating booking'
      });
    }

    return res.status(201).json({
      message: 'Booking created successfully',
      id: response.insertedId
    });
  } catch (error) {
    console.error('Error creating booking:', error);

    return res.status(500).json({
      message: 'Error creating booking'
    });
  }
};

// PUT update a booking
const updateBooking = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid booking ID'
      });
    }

    const errorMessage = validateBooking(req.body || {});

    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      });
    }

    const {
      customerName,
      email,
      tourId,
      bookingDate,
      numberOfPeople,
      totalPrice,
      status
    } = req.body;

    const booking = {
      customerName,
      email,
      tourId,
      bookingDate,
      numberOfPeople,
      totalPrice,
      status
    };

    const response = await getDb()
      .collection('bookings')
      .replaceOne(
        { _id: new ObjectId(req.params.id) },
        booking
      );

    if (response.matchedCount === 0) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error updating booking:', error);

    return res.status(500).json({
      message: 'Error updating booking'
    });
  }
};

// DELETE a booking
const deleteBooking = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid booking ID'
      });
    }

    const response = await getDb()
      .collection('bookings')
      .deleteOne({
        _id: new ObjectId(req.params.id)
      });

    if (response.deletedCount === 0) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting booking:', error);

    return res.status(500).json({
      message: 'Error deleting booking'
    });
  }
};

module.exports = {
  getAllBookings,
  getSingleBooking,
  createBooking,
  updateBooking,
  deleteBooking
};
