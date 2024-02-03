const mongoose = require("mongoose");
// mongodb+srv://xl2901:5fd80m87RkVNoeNJ@mern-ai.quw4n02.mongodb.net/?retryWrites=true&w=majority
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://xl2901:5fd80m87RkVNoeNJ@mern-ai.quw4n02.mongodb.net/mern-ai?retryWrites=true&w=majority"
    );

    console.log(`Mongodb connected`);
  } catch (error) {
    console.error(`Error connecting to MongoDB ${error.message}`);
    process.exit(1); // EXIT THE PROCESS
  }
};

module.exports = connectDB;