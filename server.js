const express = require('express');
const dotenv = require('dotenv');
const { initDb } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Tours and booking routes
app.use('/tours', require('./routes/tours'));
app.use('/bookings', require('./routes/bookings'));

// Home route
app.get('/', (req, res) => {
  res.send('Travel Tours API is running!');
});


const startServer = async () => {
  try {
    await initDb();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
};

startServer();