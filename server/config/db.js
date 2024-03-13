const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://atlas:zenith@atlas.70hcd.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("db connected");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = connectDB;
