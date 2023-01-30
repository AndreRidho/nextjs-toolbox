const nodemailer = require("nodemailer");

exports.handler = async (event, context, callback) => {
  // Generate OTP
  const otp = Math.floor(Math.random() * 1000000);

  // Send OTP to user's email
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "wetmemeslayer1@gmail.com",
      pass: "andreridho"
    }
  });

  const mailOptions = {
    from: "wetmemeslayer1@gmail.com",
    to: event.queryStringParameters.email,
    subject: "OTP for your transaction",
    text: `Your OTP is: ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("OTP sent: " + info.response);
    }
  });

  // Compare OTP
  const receivedOtp = event.queryStringParameters.otp;
  let result;
  if (receivedOtp === otp) {
    result = "Success";
  } else {
    result = "Fail";
  }

  // Return result
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      result: result,
      otpExpiry: 300 // 5 minutes in seconds
    })
  };
  callback(null, response);
};