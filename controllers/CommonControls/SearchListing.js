const Model = require("../../models/model");

async function SearchListing(data) {
  const page = parseInt(data.page) - 1 || 0;
  const limit = parseInt(data.limit) || 16;
  // console.log("Req body:", data.name)
  const newData = await Model.find({
    $or: [
      { name: { $regex: data.searchString, $options: "i" } },
      { description: { $regex: data.searchString, $options: "i" } },
      { property_type: { $regex: data.searchString, $options: "i" } },
      { "address.street": { $regex: data.searchString, $options: "i" } },
      { "address.country": { $regex: data.searchString, $options: "i" } },
      { "address.suburb": { $regex: data.searchString, $options: "i" } },
      { amenities: { $regex: data.searchString, $options: "i" } },
      { summary: { $regex: data.searchString, $options: "i" } },
    ],
  }).skip(page * limit)
  .limit(limit);
   // console.log("reached getALl", newData);
   if(newData.length<1){
    newData=null
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
