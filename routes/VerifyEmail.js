const express = require("express");
const saveUser = require("../controllers/SignUp/saveUser");
const saveHost = require("../controllers/HostControls/saveHost");
const User = require("../models/users");
const Model = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
var nodemailer = require("nodemailer");


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
    password: req.body.password,
    verified:false,
    verifyToken: randomVerifyCode
  };
  // console.log(data)
  if (
    data.userType &&
    data.email &&
    data.password
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
            res.send("Verify Your Email")
          }
        });
      }
      else{
        if (data.password === req.body.confirmPassword) {
       
          data.password = await bcrypt.hash(data.password,12)
          
          const response =await saveUser(data)
          const token = jwt.sign({ userID: response._id }, process.env.SECRET_KEY, { expiresIn: '5d' })
        
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
            res.send("Verify Your Email")
          }
        });
      
    } else {
      res.send("Passwords and Confirm Password must match");
    }

      }
     
    } else {
      const emailExist = await Model.findOne({ email: data.email });
      if (data.password === req.body.confirmPassword) {
        if (emailExist) {
        // console.log("inside email exist", emailExist.verifyToken)
        const response = await Model.findOneAndUpdate({email:data.email},{verifyToken:randomVerifyCode},{password:0,verifyToken:0})
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "t39200309@gmail.com",
              pass: "mgoh yewc ufly mduz",
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
              res.send("Verify Your Email")
            }
          });

        } 
        // console.log("emailExist", emailExist)
        else {
          data = { ...data, host: req.body.host,verifyToken:randomVerifyCode, verified:false };
          data.password = await bcrypt.hash(data.password,12)
            
            const response =await saveHost(data)
            const token = jwt.sign({ userID: response._id }, process.env.SECRET_KEY, { expiresIn: '5d' })
          
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "t39200309@gmail.com",
              pass: "mgoh yewc ufly mduz",
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
              res.send("Verify Your Email")
            }
          });
        }
      } else {
        res.send("Passwords and Confirm Password must match");
      }
    }
  } else {
    res.send("All fields are required");
  }
});

module.exports = router;
