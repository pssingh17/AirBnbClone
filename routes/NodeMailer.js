require('dotenv').config();
var nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "t39200309@gmail.com",
        pass: process.env.NodeMailerPass,
    },
  });
  const SENDMAIL = async (mailDetails, callback) => {
    try {
      const info = await transporter.sendMail(mailDetails)
      callback(info);
    } catch (error) {
      console.log(error);
    } 
  };
module.exports = SENDMAIL