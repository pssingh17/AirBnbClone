const express = require("express");
const saveUser = require("../controllers/SignUp/saveUser");
const saveHost = require("../controllers/HostControls/saveHost");
const User = require("../models/users");
const Model = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
var nodemailer = require("nodemailer");
require('dotenv').config();



const router = express.Router();

var bodyParser = require("body-parser");
const SaveHost = require("../controllers/HostControls/saveHost");
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
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "t39200309@gmail.com",
            pass: process.env.NodeMailerPass,
          },
        });

        var mailOptions = {
          from: "t39200309@gmail.com",
          to: data.email,
          subject: "Verify Your Email",
          text: `Verification code is - ${randomVerifyCode}`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
             
            console.log("Email sent: " + info.response);
            
            res.json({message:"Verify Your email", response:response.verified})
          }
        });
        
       
      }
     else{
      res.json({message:"Email Dont Exist"});
     }
        
      
    } else {
      
        const emailExist = await Model.findOne({ email: data.email });
        // console.log("emailExist", emailExist)
        if (emailExist) {
          const response = await Model.findOneAndUpdate({email:data.email},{verifyToken:randomVerifyCode},{password:0,verifyToken:0})
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "t39200309@gmail.com",
              pass: process.env.NodeMailerPass,
            },
          });

          var mailOptions = {
            from: "t39200309@gmail.com",
            to: data.email,
            subject: "Verify Your Email",
            text: `Verification code is - ${randomVerifyCode}`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
               
              console.log("Email sent: " + info.response);
              res.json({message:"Verify Your email", response:response.verified})
            }
          });
         
          res.json({message:"Verify Your email", response:response.verified})
        } 
        else{
          res.json({message:"Email Dont Exist"});
        }
      } 
    }
  }
  

);

module.exports = router;
