const express = require("express");
const User = require("../../models/users");
const Model = require("../../models/model");
var mongo = require("mongodb");

const app = express();
const jwt = require("jsonwebtoken");

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const router = express.Router();

router.post("/deleteReview", async (req, res) => {
  // console.log(req.body)
  let host_id = req.body.host_id
  let date = req.body.date
  // console.log("date", date)
  if (req.body.userType === "User") {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      // Get Token from header
      let token = authorization.split(" ")[1];

      
      try{
        // console.log("inside try")
            // Verify Token
      const { userID } = jwt.verify(token, process.env.SECRET_KEY);
      // console.log("userID", userID);
      var o_id = new mongo.ObjectID(userID);
      }
      catch(e){
        console.log("inside catch")
        return  res.status(400).json({message:"Invalid Token", loggedIn:false, userType:"User"})
      }
  

      const userData = await User.findOne({ _id: o_id });
      
      // console.log("user data booking api check", req.body);
      let response;
      if (userData && date) {
        const resp = await Model.findOneAndUpdate(
          { "host.host_id": host_id },
          { $pull: {"reviews":{date:date}}},{  safe: true, upsert: true}
        ).select("-password");
        response = await Model.findOne({  "host.host_id": host_id },{password:0,verifyToken:0});

        res.json({
          message: "Success",
          credentials: response,
        });
      }
    } else {
      res.send("Cannot allow action here");
    }
  } else {
    res.send("Cannot process request");
  }
});

module.exports = router;
