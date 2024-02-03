
require('dotenv').config();
const mongoose = require("mongoose");
const MongoDBUrl = process.env.DB_CONNECTION_STRING;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect( MongoDBUrl
    );

    console.log(`Mongodb connected`);
  } catch (error) {
    console.error(`Error connecting to MongoDB ${error.message}`);
    process.exit(1); // EXIT THE PROCESS
  }
};

module.exports = connectDB;