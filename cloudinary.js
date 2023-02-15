// var cloudinary = require('cloudinary');
// var cloudinary = require('cloudinary').v2;
// import { v2 as cloudinary } from 'cloudinary'

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}); 
uploadToCloudinary = (path, folder)=>{
    return cloudinary.uploader.upload(path,
        {
            folder
        }).then((data)=>{
            // console.log("cloud resp", data)
            return {url:data.url, public_id: data.public_id}
        }).catch((error)=>{
            console.log(error)
        })
}
module.exports = uploadToCloudinary;
