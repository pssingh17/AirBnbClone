const express = require('express')
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const User = require("../models/users")
const Model = require("../models/model")


router.post("/",async (req,res)=>{
    console.log("forgot password endpoint")
    var data = {
        userType : req.body.userType,
        email : req.body.email,
        newPassword : req.body.newPassword,
        confirmNewPassword : req.body.confirmNewPassword
    }
    try{
    if(data.userType && data.email && data.newPassword && data.confirmNewPassword && req.body.verificationCode){
        if(data.userType === "User"){
            if(data.newPassword === data.confirmNewPassword){
                const userData = await User.findOne({email:data.email})
                if(userData && userData.verifyToken === req.body.verificationCode){
                    
                   
                        newHashPassword = await bcrypt.hash(data.newPassword, 12)
                        await User.findOneAndUpdate(userData._id, { $set: { password: newHashPassword } },{password:0,verifyToken:0}).then(response=>{res.json({"message":"Password Change Success"})}).
                        catch(err=>{res.send(err)})
                  
                    
                }
                else{
                    res.json({"message": "Invalid Verification Code"})
                }
               }
               else{
                res.json({"message":"New Password and Confirm New Passwords dont match"})
               }
        
        }
        else{
            if(data.newPassword === data.confirmNewPassword){
                const userData = await Model.findOne({email:data.email})
                if(userData && userData.verifyToken === req.body.verificationCode){
                    
                   
                        newHashPassword = await bcrypt.hash(data.newPassword, 12)
                        await Model.findOneAndUpdate(userData._id, { $set: { password: newHashPassword } },{password:0,verifyToken:0}).then(response=>{res.json({"message":"Password Change Success"})}).
                        catch(err=>{res.send(err)})
                   
                    
                }
                else{
                    res.json({"message": "Invalid Verification Code"})
                }
               }
               else{
                res.json({"message":"New Password and Confirm New Passwords dont match"})
               }
        }
       
    }
    else{
        res.send("All fields required")
    }
   
    }
    catch(error){
        res.send(error)
    }
    
})


module.exports = router;