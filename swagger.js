
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Travel Tours API',
    description: 'API for managing tours and bookings'
  },

  host: 'cse341-project2-clr4.onrender.com',

  schemes: ['https'],

  consumes: ['application/json'],

  produces: ['application/json']
};

const outputFile = './swagger.json';

const endpointsFiles = [
  './server.js',
  './routes/tours.js',
  './routes/bookings.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);
