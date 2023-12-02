const mongoose = require("mongoose");
require("dotenv").config();

const { DB_URL } = process.env;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB..."))
  .catch((err) => console.log("REASON", err));

module.exports = mongoose;
