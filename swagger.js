const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Travel Tours API',
    description: 'API for managing travel tours and bookings'
  },
  host: 'cse341-project2.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger.json';

const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);