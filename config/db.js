// Mongo connection
const mongoose = require("mongoose");
const config = require("config");
const uri = config.get("mongoURI");
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      // await mongoose.connect("mongodb://127.0.0.1/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Get rid of deprecation warning
      useCreateIndex: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    // Note: err.message
    console.log(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
module.exports = connectDB;
