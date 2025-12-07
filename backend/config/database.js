const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URL = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@clusterairbnb.2vv7oxe.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority&appName=ClusterAirbnb`;

exports.connectDB = () => {
  mongoose
    .connect(MONGODB_URL)
    .then(() => console.log("DB Connected Successfully"))
    .catch((e) => {
      console.log("DB Connected failed-->", e);
      process.exit(1);
    });
};
