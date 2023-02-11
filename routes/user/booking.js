const express = require("express");
const User = require("../../models/users");
var mongo = require("mongodb");

const app = express();
const jwt = require("jsonwebtoken");

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const router = express.Router();

router.post("/booking", async (req, res) => {
  // console.log(req.body)
  if (req.body.userType === "User") {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      // Get Token from header
      let token = authorization.split(" ")[1];

      // Verify Token
      const { userID } = jwt.verify(token, process.env.SECRET_KEY);
      console.log("userID", userID);

      var o_id = new mongo.ObjectID(userID);

      const userData = await User.findOne({ _id: o_id });
      let data = req.body;
      // console.log("user data booking api check", req.body);
      let response;
      if (userData && data) {
        const resp = await User.findOneAndUpdate(
          { _id: o_id },
          { $push: { "bookings": data } }
        ).select("-password");
        response = await User.findOne({ _id: o_id },{password:0,verifyToken:0});

        res.json({
          message: "Success",
          credentials: response,
        });
      }
    } else {
      res.send("Cannot change password here");
    }
  } else {
    res.send("Cannot process request");
  }
});

module.exports = router;
