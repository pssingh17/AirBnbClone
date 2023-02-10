const Model = require("../../models/model");
 var mongo = require('mongodb');

async function GetById(req) {
    console.log("Get by id function id:", req.body.Id)
  
   
  let newData
    newData = await Model.findOne({"host.host_id": req.body.Id}).select('-password')
    
    console.log("New data kith aa: ",newData)
  
 
  
  // console.log("reached getALl", newData);
  const response = {
    error: false,
    dataFrom:"GetByID",
    newData,
    
  };
  //   console.log("con", response);
  return response;
}
module.exports = GetById;
