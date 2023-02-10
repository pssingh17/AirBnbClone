const express = require("express");
const Model = require("../../models/model");
var mongo = require('mongodb');

const app = express();
const jwt = require("jsonwebtoken")

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const router = express.Router();


router.post("/deleteHostListing", async (req, res) => {
    if(req.body.password == undefined){
      const { authorization } = req.headers
      if (authorization && authorization.startsWith('Bearer')) {
      
          // Get Token from header
          let token = authorization.split(' ')[1]
    
          // Verify Token
          const { userID } = jwt.verify(token, process.env.SECRET_KEY)
          console.log("userID", userID)
          
          //   var ObjectId = require('mongodb').ObjectId;
          var o_id = new mongo.ObjectID(userID);
      
            const userData = await Model.findOne({_id:o_id})

              if(userData){
                let data ={
                    _id : userData._id,
                    userType: userData.userType,
                    email: userData.email,
                    password: userData.password
                  }
                      const resp = await Model.replaceOne({_id:o_id}, data)
                      const response = await Model.findOne({_id:o_id})
                      res.json({"message":"Success", "credentials":response})
                  }
                 
      }
    }
    else{
      res.send("Cannot change password here")
    }
   
 
});


module.exports = router;
