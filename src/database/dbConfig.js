const mongoose = require("mongoose");
const dotenv = require("dotenv");

//load dotenv
dotenv.config();

//connect Database
const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Database connected: ${conn.connection.host}, ${conn.connection.name}`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;
