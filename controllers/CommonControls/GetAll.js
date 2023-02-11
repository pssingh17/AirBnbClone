const Model = require("../../models/model");

async function GetAll(req) {
  const page = parseInt(req.body.page) - 1 || 0;
  const limit = parseInt(req.body.limit) || 16;
  let sort = req.body.sort || "price";
  let amenities = req.body.amenities || "All";
  let priceRange = undefined || req.body.priceRange
  
  let maxNumber
  // console.log("1st check",priceRange)
  const amenitiesOptions = ["TV","Internet","Kitchen","Free parking on premises","Heating","Washer","Smoke detector","Laptop friendly workspace","Air conditioning","Gym","Wheelchair accessible","Family/kid friendly"];

  amenities === "All"
    ? (amenities = [...amenitiesOptions])
    : (amenities =req.body.amenities.map((item)=>{return item.value}));
  req.body.sort ? (sort = req.body.sort.split(",")) : (sort = [sort]);
  // console.log("Amenities:", amenities)
  let sortBy = {};
  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = "asc";
  }

  // console.log("SortBY: ", sortBy);
  // });
  let newData
  
  if(priceRange === undefined){
    newData = await Model.find({},{"_id":true,password:0,verifyToken:0})
    .where("amenities" )
    .in([...amenities])
    // .sort(sortBy)
    .skip(page * limit)
    .limit(limit);
    // console.log("New data kith aa: ",newData)
  }
  else{
    priceRange = req.body.priceRange.map((item)=>{return item.value})
    // console.log("Price range:", priceRange)
    maxNumber = Math.max(...priceRange)
    // console.log("MAx number:", maxNumber)
    
    if(maxNumber===100){
      minPrice=0,
      maxPrice=100
    }
    else if(maxNumber===500){
      minPrice=101
      maxPrice=500
    }
    else if(maxNumber===1000){
      minPrice=501
      maxPrice=1000
    }
    else{
      minPrice=1001
      maxPrice=10000000
    }
    // console.log("Min and max are:",minPrice,maxPrice)
   
    newData = await Model.find({ $and: [
      { price: { $lt: maxPrice } },
      { price: { $gt: minPrice } },
    ],},{password:0,verifyToken:0})     
    .where("amenities" )
    .in([...amenities])
    // .sort(sortBy)
    .skip(page * limit)
    .limit(limit);
    // console.log("New data kith aa: ",newData)
  }
  
  // console.log("reached getALl", newData);
  const response = {
    error: false,
    dataFrom:"GetAll",
    page: page + 1,
    limit,
    amenities: amenities,
    priceRange:maxNumber,
    newData,
    
  };
  //   console.log("con", response);
  return response;
}
module.exports = GetAll;
