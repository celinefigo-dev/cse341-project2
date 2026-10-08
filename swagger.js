const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Travel Tours API',
    description: 'API for managing tours and bookings with GitHub OAuth authentication'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);