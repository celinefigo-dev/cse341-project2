const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// GET all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await getDb()
      .collection('bookings')
      .find()
      .toArray();

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error retrieving bookings'
    });
  }
};

// GET one booking
const getSingleBooking = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid booking ID'
      });
    }

    const booking = await getDb()
      .collection('bookings')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error retrieving booking'
    });
  }
};

// CREATE booking
const createBooking = async (req, res) => {
  try {
    const {
      customerName,
      email,
      tourId,
      bookingDate,
      numberOfPeople,
      totalPrice,
      status
    } = req.body;

    // Validation
    if (
      !customerName ||
      !email ||
      !tourId ||
      !bookingDate ||
      numberOfPeople === undefined ||
      totalPrice === undefined ||
      !status
    ) {
      return res.status(400).json({
        message: 'All booking fields are required'
      });
    }

    if (
      typeof numberOfPeople !== 'number' ||
      numberOfPeople < 1
    ) {
      return res.status(400).json({
        message: 'numberOfPeople must be a number greater than 0'
      });
    }

    if (
      typeof totalPrice !== 'number' ||
      totalPrice < 0
    ) {
      return res.status(400).json({
        message: 'totalPrice must be a valid number'
      });
    }

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

    if (response.acknowledged) {
      res.status(201).json({
        message: 'Booking created successfully',
        id: response.insertedId
      });
    } else {
      res.status(500).json({
        message: 'Error creating booking'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating booking'
    });
  }
};

// UPDATE booking
const updateBooking = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid booking ID'
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

    // Validation
    if (
      !customerName ||
      !email ||
      !tourId ||
      !bookingDate ||
      numberOfPeople === undefined ||
      totalPrice === undefined ||
      !status
    ) {
      return res.status(400).json({
        message: 'All booking fields are required'
      });
    }

    if (
      typeof numberOfPeople !== 'number' ||
      numberOfPeople < 1
    ) {
      return res.status(400).json({
        message: 'numberOfPeople must be a number greater than 0'
      });
    }

    if (
      typeof totalPrice !== 'number' ||
      totalPrice < 0
    ) {
      return res.status(400).json({
        message: 'totalPrice must be a valid number'
      });
    }

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

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating booking'
    });
  }
};

// DELETE booking
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

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
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