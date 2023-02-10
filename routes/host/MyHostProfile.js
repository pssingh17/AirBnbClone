const express = require("express");
const Model = require("../../models/model");
const User = require("../../models/users");
var mongo = require("mongodb");

const app = express();
const jwt = require("jsonwebtoken");

var bodyParser = require("body-parser");
const { json } = require("express");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const router = express.Router();

router.post("/MyHostProfile", async (req, res) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    // Get Token from header
    let token = authorization.split(" ")[1];

    // Verify Token
    const { userID } = jwt.verify(token, process.env.SECRET_KEY);
    console.log("userID", userID);

    var o_id = new mongo.ObjectID(userID);

    const userData = await Model.findOne({ _id: o_id });
   if(userData){
    let response = {
        message:"Success",
        token:token,
        credentials: userData
    }
    res.json(response)
   }
   else{
    res.send("no user found")
   }
   
  } else {
    res.send("Cannot change password here");
  }
});

module.exports = router;
