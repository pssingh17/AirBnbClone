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

router.post("/addToFavourites", async (req, res) => {
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
    // console.log("user data retriece check", userData)
    let response;
    if (userData && data.listing_url) {

      const listingExist = await Model.findOne({ listing_url:data.listing_url });
      
      
      if (listingExist) {
        // console.log("Listing Exist", listingExist)
       
        //  Database can be exploited with this validation, change later
        const resp = await User.findOneAndUpdate(
          { _id: o_id, "favourites.fav_id": { $ne: data.fav_id } },
          { $push: { favourites: data } }
        ).select("-password");
        response = await User.findOne({ _id: o_id }).select("-password");

        res.json({ message: "Update Success", credentials: response });
      }
      else{
        res.status(200).send("Listing dont exist")
      }
    } else {
      res
        .status(200)
        .json({ message: "You are either logged out or listing is invalid" });
    }
  } else {
    res.send("Cannot change password here");
  }
});

module.exports = router;
