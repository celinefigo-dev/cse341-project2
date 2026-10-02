const { MongoClient } = require('mongodb');
const dns = require('dns');

// Use Google DNS for MongoDB SRV lookup
dns.setServers(['8.8.8.8', '8.8.4.4']);

let database;

const initDb = async () => {
  if (database) {
    return database;
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();

  database = client.db('travel_tours');

  console.log('Connected to travel_tours database');

  return database;
};

const getDb = () => {
  if (!database) {
    throw new Error('Database has not been initialized');
  }

  return database;
};

module.exports = {
  initDb,
  getDb
};