const express = require("express");
const User = require("../../models/users");
var mongo = require('mongodb');

const app = express();
const jwt = require("jsonwebtoken")

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const router = express.Router();


router.post("/removeFromFavourites", async (req, res) => {
    
      const { authorization } = req.headers
      if (authorization && authorization.startsWith('Bearer')) {
      
          // Get Token from header
          let token = authorization.split(' ')[1]
          let fav_id = req.body.fav_id
          console.log("fav id: ",fav_id)
    
          
      try{
        // console.log("inside try")
            // Verify Token
      const { userID } = jwt.verify(token, process.env.SECRET_KEY);
      // console.log("userID", userID);
      var o_id = new mongo.ObjectID(userID);
      }
      catch(e){
        console.log("inside catch")
        return  res.status(400).json({message:"Invalid Token", loggedIn:false, userType:"User"})
      }
  
            const userData = await User.findOne({_id:o_id})
            // console.log("UserData", userData)

              if(userData){
                
                     
                      const resp = await User.findOneAndUpdate({_id:o_id},  { $pull: {"favourites":{fav_id:fav_id}}},{  safe: true, upsert: true}).select('-password')
                      const response = await User.findOne({_id:o_id},{password:0,verifyToken:0})
                      res.json({"message":"Update Success", "credentials":response})
                  }
                  else{
                    res.send("Listing dont exist")
                  }
      }
    
  
   
 
});


module.exports = router;
