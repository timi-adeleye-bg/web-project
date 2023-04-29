//import required modules

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const fileRoute = require("./routes/file");
const connectDb = require("./database/dbConfig");
const operatorRoute = require("./routes/operator");
const errorHandler = require("../src/middlewares/errorHandler");

//configure dotenv
dotenv.config();

//connect to port
const port = process.env.PORT || process.env.port;

// load Database
connectDb();

//load app
const app = express();

//configure body parser
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//configure cross origin
app.use(cors({ origin: /http:\/\/localhost/ }));
app.options("*", cors());

//route configuration
app.get("/", (req, res) => {
  res.send("OK");
});

app.use("/api/users", userRoute); //user route configuration
app.use("/api/files", fileRoute); //file route configuration to upload files
app.use("/api/operator", operatorRoute); // operator route configuration
app.use(errorHandler); // middleware to handle errors

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
