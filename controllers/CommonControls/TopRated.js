const Model = require("../../models/model");

async function TopRated(req) {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 16;
  // console.log("page:", page);
  // });
  const newData = await Model.find({})
    .sort({ "review_scores.review_scores_rating": "desc" })
    .skip(page * limit)
    .limit(limit);
  // console.log("reached getALl", newData);
  const response = {
    error: false,
    dataFrom:"TopRated",
    page: page + 1,
    limit,
    newData,
  };
  //   console.log("con", response);
  return response;
}
module.exports = TopRated;
