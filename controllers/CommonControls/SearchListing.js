const Model = require("../../models/model");

async function SearchListing(data) {
  const page = parseInt(data.page) - 1 || 0;
  const limit = parseInt(data.limit) || 12;
  let title= data?.title || null
  let newData
  data.searchString = data.searchString.replace('(','\\(');
  data.searchString = data.searchString.replace(')','\\)');
  data.searchString = data.searchString.replace('+','\\+');
  data.searchString = data.searchString.replace('-','\\-');
  // console.log("Req body:", data)
  if(title != null){
     newData = await Model.find({
    $or: [
      { "address.country": { $regex: data.searchString, $options: "i" } },
      { "address.suburb": { $regex: data.searchString, $options: "i" } },
      { "address.street": { $regex: data.searchString, $options: "i" } },
      { "address.government_area": { $regex: data.searchString, $options: "i" } },
      { "address.market": { $regex: data.searchString, $options: "i" } },
      { "address.country_code": { $regex: data.searchString, $options: "i" } },
      { name: { $regex: data.searchString, $options: "i" }} ,
      { name: { $regex: data.searchString, $options: "ix" }} ,
      { description: { $regex: data.searchString, $options: "i" } },
      { description: { $regex: data.searchString, $options: "ix" } },
      { summary: { $regex: data.searchString, $options: "i" } },
      { summary: { $regex: data.searchString, $options: "ix" } },
      { amenities: { $regex: data.searchString, $options: "i" } },
      
    ],
  },{name:1, address:1}).skip(page * 5)
  .limit(30)
  }
  else{
      newData = await Model.find({
    $or: [
      { name: { $regex: data.searchString, $options: "i" }} ,
      { name: { $regex: data.searchString, $options: "ix" }} ,
      { "address.country": { $regex: data.searchString, $options: "i" }} ,
        { "address.suburb": { $regex: data.searchString, $options: "i" } },
      { "address.street": { $regex: data.searchString, $options: "i" } },
      { "address.government_area": { $regex: data.searchString, $options: "i" } },
      { "address.market": { $regex: data.searchString, $options: "i" } },
      { "address.country_code": { $regex: data.searchString, $options: "i" } },
      { description: { $regex: data.searchString, $options: "i" } },
      { description: { $regex: data.searchString, $options: "ix" } },
      { summary: { $regex: data.searchString, $options: "i" } },
      { summary: { $regex: data.searchString, $options: "ix" } },
     
      { "address.street": { $regex: data.searchString, $options: "i" } },
    
      { amenities: { $regex: data.searchString, $options: "i" } },

    ],
  },{password:0,verifyToken:0}).skip(page * limit)
  .limit(limit);
   // console.log("reached getALl", newData);
   if(newData.length<1){
    newData=null
   }
  }
 
   const response = {
    error: false,
    dataFrom:"Search",
    page: page + 1,
    limit,
    query:data.searchString,
    newData,
    
  };
  //   console.log("con", response);
  return response;
  
}
module.exports = SearchListing;
