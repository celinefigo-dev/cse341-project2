const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// GET all tours
const getAllTours = async (req, res) => {
  try {
    const tours = await getDb()
      .collection('tours')
      .find()
      .toArray();

    res.status(200).json(tours);
  } catch (error) {
    console.error(error);
    res.status(500).json({
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

    res.status(200).json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error retrieving tour'
    });
  }
};

// CREATE a tour
const createTour = async (req, res) => {
  try {
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

    // Validation
    if (
      !name ||
      !location ||
      !description ||
      price === undefined ||
      !duration ||
      !category ||
      available === undefined ||
      maxGuests === undefined
    ) {
      return res.status(400).json({
        message: 'All tour fields are required'
      });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({
        message: 'Price must be a valid number'
      });
    }

    if (typeof maxGuests !== 'number' || maxGuests < 1) {
      return res.status(400).json({
        message: 'maxGuests must be a number greater than 0'
      });
    }

    if (typeof available !== 'boolean') {
      return res.status(400).json({
        message: 'available must be true or false'
      });
    }

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

    if (response.acknowledged) {
      res.status(201).json({
        message: 'Tour created successfully',
        id: response.insertedId
      });
    } else {
      res.status(500).json({
        message: 'Error creating tour'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating tour'
    });
  }
};

// UPDATE a tour
const updateTour = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid tour ID'
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

    // Validation
    if (
      !name ||
      !location ||
      !description ||
      price === undefined ||
      !duration ||
      !category ||
      available === undefined ||
      maxGuests === undefined
    ) {
      return res.status(400).json({
        message: 'All tour fields are required'
      });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({
        message: 'Price must be a valid number'
      });
    }

    if (typeof maxGuests !== 'number' || maxGuests < 1) {
      return res.status(400).json({
        message: 'maxGuests must be a number greater than 0'
      });
    }

    if (typeof available !== 'boolean') {
      return res.status(400).json({
        message: 'available must be true or false'
      });
    }

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

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
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

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
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