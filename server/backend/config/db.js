const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let uri = process.env.NODE_ENV.MONGO_URI;
    const con = await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("connectDB error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
