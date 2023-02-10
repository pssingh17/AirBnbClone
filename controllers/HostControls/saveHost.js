const Model = require("../../models/model");
async function SaveHost(data) {
  var newData = new Model(data);
  await newData.save();
//   console.log("reached in save host function", data);
  return newData;
}
module.exports = SaveHost;