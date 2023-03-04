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
    try{
      // console.log("inside try")
          // Verify Token
    const { userID } = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("userID", userID);
    var o_id = new mongo.ObjectID(userID);
    }
    catch(e){
      console.log("inside catch")
      return  res.status(400).json({message:"Invalid Token", loggedIn:false, userType:"Host"})
    }


    const hostData = await Model.findOne({ _id: o_id },{password:0,verifyToken:0});
    const userData = await User.find({ "bookings.listing_id": hostData?.host?.host_id },{password:0,verifyToken:0});
    // console.log("Userdata",userData)
    let response
    let notificationData=[]
   if(hostData){
    if(userData){
      for(var i=0 ; i< userData.length; i++){
        let filter = (userData[i].bookings.filter((data)=>{
          return data.listing_id == hostData?.host?.host_id
        }))
        // console.log("FIlter", filter)
        notificationData.push({...filter, userName:userData[i].email})
      }
    
      // console.log("notification inside", notificationData)
      response = {
        message:"Success",
        token:token,
        credentials: hostData,
        notifications:notificationData
    }
    }
    else{
      response = {
        message:"Success",
        token:token,
        credentials: hostData
    }
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
