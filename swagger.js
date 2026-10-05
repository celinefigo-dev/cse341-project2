const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Travel Tours API',
    description: 'API for managing travel tours and bookings'
  },
  host: 'localhost:3000',
  schemes: ['https']
};

const outputFile = './swagger.json';

const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);