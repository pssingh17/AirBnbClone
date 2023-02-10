const Model = require("../../models/model");

async function TopPicked(req) {
  const page = parseInt(req.body.page) - 1 || 0;
  const limit = parseInt(req.body.limit) || 16;
  const newData = await Model.find({
    $and: [
      { number_of_reviews: { $gt: 10 } },
      { "review_scores.review_scores_rating": { $gt: 80 } },
    ],
  })
    .skip(page * limit)
    .limit(limit);
  // console.log("reached getALl", newData);
  const response = {
    dataFrom:"TopPicked",
    error: false,
    page: page + 1,
    limit: limit,
    newData,
  };
  //   console.log("con", response);
  return response;
}
module.exports = TopPicked;
