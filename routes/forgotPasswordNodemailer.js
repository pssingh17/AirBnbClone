const express = require("express");
const saveUser = require("../controllers/SignUp/saveUser");
const saveHost = require("../controllers/HostControls/saveHost");
const User = require("../models/users");
const Model = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
require('dotenv').config();



const router = express.Router();

var bodyParser = require("body-parser");
const SaveHost = require("../controllers/HostControls/saveHost");
const NodeMailer = require("./NodeMailer");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
require("dotenv").config();

router.post("/", async (req, res) => {
//   console.log(req.body.host);
    let randomVerifyCode = Math.floor(100000 + Math.random() * 900000)
    // console.log("Random Code:",randomVerifyCode)
  var data = {
    userType: req.body.userType,
    email: req.body.email,
    verifyToken: randomVerifyCode
  };
  if (
    data.userType &&
    data.email 
  ) {
    if (data.userType === "User") {
      const emailExist = await User.findOne({ email: data.email });
      // console.log("emailExist", emailExist)
      if (emailExist) {
        const response = await User.findOneAndUpdate({email:data.email},{verifyToken:randomVerifyCode},{password:0,verifyToken:0})
       const resp= NodeMailer(data,randomVerifyCode)
       console.log("Nodemailer resp:", resp)
       if(resp){
        res.json({message:"Verify Your email", response:response.verified})
       }
        
       
      }
     else{
      res.json({message:"Email Dont Exist"});
     }
        
      
    } else {
      
        const emailExist = await Model.findOne({ email: data.email });
        // console.log("emailExist", emailExist)
        if (emailExist) {
          const response = await Model.findOneAndUpdate({email:data.email},{verifyToken:randomVerifyCode},{password:0,verifyToken:0})
          const resp= NodeMailer(data,randomVerifyCode)
       console.log("Nodemailer resp:", resp)
       if(resp){
        res.json({message:"Verify Your email", response:response.verified})
       }
        } 
        else{
          res.json({message:"Email Dont Exist"});
        }
      } 
    }
  }
  

);

module.exports = router;
