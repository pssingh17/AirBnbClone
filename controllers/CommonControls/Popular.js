const Model = require("../../models/model");

async function Popular(req) {
  const page = parseInt(req.body.page) - 1 || 0;
  const limit = parseInt(req.body.limit) || 12;
  let sortPrice = (req.body.sortPrice) || "asc"

    console.log("sortprice:", sortPrice);
  // });
  const newData = await Model.find({},{password:0,verifyToken:0})
    .sort({ "number_of_reviews": "desc","price":sortPrice })
    .skip(page * limit)
    .limit(limit);
  // console.log("reached getALl", newData);
  const response = {
    error: false,
    dataFrom:"Trending",
    page: page + 1,
    limit,
    newData,
  };
  //   console.log("con", response);
  return response;
}
module.exports = Popular;
