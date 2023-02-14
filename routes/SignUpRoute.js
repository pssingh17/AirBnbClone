
const express = require('express');
const saveUser = require('../controllers/SignUp/saveUser');
const User = require('../models/users');
const Model = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express();

const router = express.Router();

var bodyParser = require("body-parser");
const SaveHost = require('../controllers/HostControls/saveHost');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
require('dotenv').config();

router.post("/",async (req,res)=>{
    // console.log("check if", data)
    // console.log(req.body.host)
    var data = {
        userType: req.body.userType,
        email : req.body.email,
        verificationCode:req.body.verificationCode
    }
    if(data.userType && data.email && data.verificationCode){
        
        if(data.userType === "User"){
            
                const emailExist = await User.findOne({email:data.email})
                // console.log("emailExist", emailExist)
                if(emailExist?.verifyToken === data.verificationCode){
                    const response = await User.findOneAndUpdate({email:data.email},{verified:true},{password:0,verifyToken:0})
                    const token = jwt.sign({ userID: response?._id }, process.env.SECRET_KEY, { expiresIn: '5d' })
                    // res.cookie('token',token)
                    res.json({"message":"Verified Successfully","credentials":{"_id":response._id,"userType":response
                    .userType,"email":response.email, "verified": response.verified},"token": token})
                }
                else{
                    res.send("Invalid code")
                }
                    
                }
                
            
          

    
        else{
            if(data.userType && data.email  && data.verificationCode){
                const emailExist = await Model.findOne({email:data.email})
                // console.log("emailExist", emailExist)
                if(emailExist?.verifyToken === data.verificationCode){
                    const response = await Model.findOneAndUpdate({email:data.email},{verified:true},{password:0,verifyToken:0})
                    const token = jwt.sign({ userID: response?._id }, process.env.SECRET_KEY, { expiresIn: '5d' })
                    // res.cookie('token',token)
                    res.json({"message":"Verified Successfully","credentials":{"_id":response._id,"userType":response
                    .userType,"email":response.email, "verified": response.verified},"token": token})
                }
                else{
                    res.send("Invalid code")
                }
              
                
            }
            else{
                res.send("Do the signUp process again")
            }
        }
       
     
    }
    else{
        res.send("All fields are required")
    }
    
})

module.exports = router;