const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log(connection.connection.host);
  } catch (error) {
    console.log("Error connecting to db", error);
  }
};

module.exports = connectDb;
