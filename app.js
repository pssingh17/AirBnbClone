const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const Model = require("./models/model");

const commonRoutes = require("./routes/commonRoutes");
const signUp = require("./routes/SignUpRoute");
const verifyEmail = require("./routes/VerifyEmail");
const login = require("./routes/Login");
const changePassword = require("./routes/changePassword");
const forgotChangePassword = require("./routes/forgotChangePassword");
const forgotPasswordNodemailer = require("./routes/forgotPasswordNodemailer");
const UpdateHostListing = require("./routes/host/UpdateHostListing");
const deleteHostListing = require("./routes/host/deleteHostListing");
const addToFavourites = require("./routes/user/addToFavourites");
const removeFromFavourites = require("./routes/user/removeFromFavourites");
const MyUserProfile = require("./routes/user/MyUserProfile");
const MyHostProfile = require("./routes/host/MyHostProfile");
const payment = require("./routes/user/payment");
const booking = require("./routes/user/booking");
const addReview = require("./routes/user/addReview");
const deleteReview = require("./routes/user/DeleteReview");
require('dotenv').config();
const path = require('path')
const app = express();

// ADD THIS
var cors = require("cors");
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(express.json());
const dbSchema = Model.dbSchema;

require("dotenv").config();
const mongoString = process.env.DATABASE_URL;
mongoose.set("strictQuery", true);
mongoose.connect(mongoString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");

  app.listen(process.env.PORT || 5000, () => {
    console.log(`app listenig on port ${process.env.PORT}`);
  });
});
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});
// Unprotected routes
app.use("/api/", commonRoutes);
// Common routes for user and host signup/login
app.use("/signup", signUp);
app.use("/verifyEmail", verifyEmail);
app.use("/login", login);
app.use("/changePassword", changePassword);
app.use("/forgotChangePassword", forgotChangePassword);
app.use("/forgotPasswordEmail", forgotPasswordNodemailer);
// Host Routes
app.use("/host", MyHostProfile);
app.use("/host", UpdateHostListing);
app.use("/host", UpdateHostListing);
app.use("/host", deleteHostListing);
// User Routes
app.use("/user", MyUserProfile);
app.use("/user", addToFavourites);
app.use("/user", removeFromFavourites);
app.use("/user", payment);
app.use("/user", booking);
app.use("/user", addReview);
app.use("/user", deleteReview);

app.use("*",(req,res)=>{
  res.status(404).json("Invalid Path")
})
