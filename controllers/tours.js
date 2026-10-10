
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// Validate tour information
const validateTour = (tour) => {
  const {
    name,
    location,
    description,
    price,
    duration,
    category,
    available,
    maxGuests
  } = tour;

  // Check required fields
  if (
    name === undefined ||
    location === undefined ||
    description === undefined ||
    price === undefined ||
    duration === undefined ||
    category === undefined ||
    available === undefined ||
    maxGuests === undefined
  ) {
    return 'All tour fields are required';
  }

  // Validate text fields
  const textFields = [
    name,
    location,
    description,
    duration,
    category
  ];

  if (
    textFields.some(
      (value) =>
        typeof value !== 'string' ||
        value.trim() === ''
    )
  ) {
    return 'Text fields must contain valid text';
  }

  // Validate price
  if (
    typeof price !== 'number' ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    return 'Price must be a valid number';
  }

  // Validate maximum guests
  if (
    !Number.isInteger(maxGuests) ||
    maxGuests < 1
  ) {
    return 'maxGuests must be a positive whole number';
  }

  // Validate availability
  if (typeof available !== 'boolean') {
    return 'available must be true or false';
  }

  return null;
};

// GET all tours
const getAllTours = async (req, res) => {
  try {
    const tours = await getDb()
      .collection('tours')
      .find()
      .toArray();

    return res.status(200).json(tours);
  } catch (error) {
    console.error('Error retrieving tours:', error);

    return res.status(500).json({
      message: 'Error retrieving tours'
    });
  }
};

// GET one tour by ID
const getSingleTour = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid tour ID'
      });
    }

    const tour = await getDb()
      .collection('tours')
      .findOne({
        _id: new ObjectId(req.params.id)
      });

    if (!tour) {
      return res.status(404).json({
        message: 'Tour not found'
      });
    }

    return res.status(200).json(tour);
  } catch (error) {
    console.error('Error retrieving tour:', error);

    return res.status(500).json({
      message: 'Error retrieving tour'
    });
  }
};

// POST create a tour
const createTour = async (req, res) => {
  try {
    const errorMessage = validateTour(req.body || {});

    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      });
    }

    const {
      name,
      location,
      description,
      price,
      duration,
      category,
      available,
      maxGuests
    } = req.body;

    const tour = {
      name,
      location,
      description,
      price,
      duration,
      category,
      available,
      maxGuests
    };

    const response = await getDb()
      .collection('tours')
      .insertOne(tour);

    if (!response.acknowledged) {
      return res.status(500).json({
        message: 'Error creating tour'
      });
    }

    return res.status(201).json({
      message: 'Tour created successfully',
      id: response.insertedId
    });
  } catch (error) {
    console.error('Error creating tour:', error);

    return res.status(500).json({
      message: 'Error creating tour'
    });
  }
};

// PUT update a tour
const updateTour = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid tour ID'
      });
    }

    const errorMessage = validateTour(req.body || {});

    if (errorMessage) {
      return res.status(400).json({
        message: errorMessage
      });
    }

    const {
      name,
      location,
      description,
      price,
      duration,
      category,
      available,
      maxGuests
    } = req.body;

    const tour = {
      name,
      location,
      description,
      price,
      duration,
      category,
      available,
      maxGuests
    };

    const response = await getDb()
      .collection('tours')
      .replaceOne(
        { _id: new ObjectId(req.params.id) },
        tour
      );

    if (response.matchedCount === 0) {
      return res.status(404).json({
        message: 'Tour not found'
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error updating tour:', error);

    return res.status(500).json({
      message: 'Error updating tour'
    });
  }
};

// DELETE a tour
const deleteTour = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid tour ID'
      });
    }

    const response = await getDb()
      .collection('tours')
      .deleteOne({
        _id: new ObjectId(req.params.id)
      });

    if (response.deletedCount === 0) {
      return res.status(404).json({
        message: 'Tour not found'
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting tour:', error);

    return res.status(500).json({
      message: 'Error deleting tour'
    });
  }
};

module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour
};
