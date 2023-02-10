const express = require("express");
const Model = require("../../models/model");
var mongo = require('mongodb');

const app = express();
const jwt = require("jsonwebtoken")

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const router = express.Router();


router.post("/updateHostListing", async (req, res) => {
    
      const { authorization } = req.headers
      if (authorization && authorization.startsWith('Bearer')) {
      
          // Get Token from header
          let token = authorization.split(' ')[1]
    
          // Verify Token
          const { userID } = jwt.verify(token, process.env.SECRET_KEY)
          console.log("userID", userID)
         
          
          // console.log(amenities1,"amenities from body:", req.body.amenities)
          let {amenities,...data} = req.body;
          if(amenities){
            amenities = req.body.amenities.split(",")
            amenities1= Array.from(new Set(amenities))
            console.log("amenities1 -",amenities1)
          }
          //   var ObjectId = require('mongodb').ObjectId;
          var o_id = new mongo.ObjectID(userID);
      
            const userData = await Model.findOne({_id:o_id})
            // console.log("user data retriece check", userData)
            let response;
              if(userData){
                await Model.findOneAndUpdate({_id:o_id}, data )
                if(amenities){
                 
                    const resp = await Model.findOneAndUpdate({_id:o_id},  { $addToSet: {"amenities":{$each: amenities1}}},{  safe: true, upsert: true}).select('-password')
                    

                }
                response = await Model.findOne({_id:o_id}).select('-password')
                 
                  res.json({"message":"Update Success","token":token, "credentials":response})
                     
                  }
      
    }
    else{
      res.send("Cannot change password here")
    }
   
 
});


module.exports = router;
