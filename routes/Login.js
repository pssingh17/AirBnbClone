const express = require('express')
const app = express();
const bcrypt = require('bcrypt')
const User = require("../models/users")
const Model = require("../models/model")
const router = express.Router();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const jwt = require("jsonwebtoken");
require('dotenv').config();

router.post('/',async (req,res)=>{
    console.log("login endpoint")
    var data = {
        userType : req.body.userType,
        email : req.body.email,
        password : req.body.password,
    }
    if(data.userType && data.email && data.password){
        try{
            if(data.userType == "User"){
                const userExist = await User.findOne({email:data.email}) 
                // console.log("User exist", userExist)
                if(userExist && userExist.verified){
                const match = await bcrypt.compare(data.password,userExist.password)
                
                if(match){
                    const response = await User.findOne({email:data.email},{password:0,verifyToken:0}) 
                    const token = jwt.sign({ userID: response._id }, process.env.SECRET_KEY, { expiresIn: '5d' })
                    // res.cookie('token',token)
                    res.json({"message":"Login Successful", "credentials":response,"token":token})
                    
                    // console.log("response", response)
                }
                else{
                    res.send("Wrong Email or Password")
                }
            }
            else{
                res.send("User email dont exist or Your Email is not Verified Yet")
            }
            }
            else{
                const userExist =  await Model.findOne({email:data.email})
                // console.log("User exist", userExist)
                if(userExist && userExist.verified){
                const match = await bcrypt.compare(data.password,userExist.password)
                
                if(match){
                    const response =  await Model.findOne({email:data.email},{password:0,verifyToken:0})
                    const token = jwt.sign({ userID: response._id }, process.env.SECRET_KEY, { expiresIn: '5d' })
                    // res.cookie('token',token)
                    res.json({"message":"Login Successful", "credentials":response,"token":token})
                    // console.log("response", response)
                }
                else{
                    res.send("Wrong Email or Password")
                }
            }
            else{
                res.send("Host email dont exist or Your Email is not Verified Yet")
            }
            }
          
        }
        catch(err){
            console.log(err)
        }
            
    }
    else{
        res.send("Enter All fields")
    }
})

module.exports = router;