require('dotenv').config();
var nodemailer = require("nodemailer");

async function NodeMailer(data,randomVerifyCode){
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "t39200309@gmail.com",
          pass: process.env.NodeMailerPass,
        },
      });

      var mailOptions = {
        from: "t39200309@gmail.com",
        to: data.email,
        subject: "Verify Your Email",
        text: `Verification code is - ${randomVerifyCode}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
           
          console.log("Email sent: " + info.response);
          
          return info
        }
      });
}

module.exports = NodeMailer