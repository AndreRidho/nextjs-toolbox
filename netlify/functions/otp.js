

// const otpExpiry = 300000; // 5 minutes in milliseconds

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

// const app = initializeApp(firebaseConfig);

// const db = getFirestore();

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCcPW6LgKrQmZELR6CTf49fZcVNKD7SHYc",
//   authDomain: "atm-serverless.firebaseapp.com",
//   projectId: "atm-serverless",
//   storageBucket: "atm-serverless.appspot.com",
//   messagingSenderId: "1076969212972",
//   appId: "1:1076969212972:web:3cabd986aeb4852e4f5589"
// };
// const admin = require('firebase-admin');

// function generateRandomString(length) {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// }

const crypto = require('crypto');
const nodemailer = require("nodemailer");

async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "wetmemeslayer1@gmail.com",
      pass: "rotltdskaidasezd"
    }
  });

  const mailOptions = {
    from: "wetmemeslayer1@gmail.com",
    to: email,
    subject: "OTP for your transaction",
    text: `Your OTP is: ${otp}`
  };

  return transporter.sendMail(mailOptions)
    .then(info => "OTP sent: " + info.response.toString())
    .catch(error => "Error:" + error.toString());
}

function storeOTP(otp, email, now){

  let tokenPlain = otp + email + now.toString;

  const hash = crypto.createHash('sha256');
  const data = tokenPlain;
  hash.update(data);
  const token = hash.digest('hex');

  return token;

}

function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

exports.handler = async function(event, context, callback) {

  try {

    const now = new Date();

    if('otp' in event.queryStringParameters && 'token' in event.queryStringParameters && 'email' in event.queryStringParameters && 'time' in event.queryStringParameters){

      let tokenPlain = event.queryStringParameters.otp + event.queryStringParameters.email + event.queryStringParameters.time;

      const hash = crypto.createHash('sha256');
      const data = tokenPlain;
      hash.update(data);
      const token = hash.digest('hex');

      if(token != event.queryStringParameters.token){
        return {
          statusCode: 400,
          body: JSON.stringify({
            result: 'Fail',
            message: 'Invalid OTP'
          }),
        };
      }

      let timeDiff = Math.abs((new Date(event.queryStringParameters.time)) - now.getTime());
      let diffMinutes = Math.abs(Math.ceil(timeDiff / (1000 * 60)));

      if(diffMinutes > 5){
        return {
          statusCode: 410,
          body: JSON.stringify({
            result: 'Fail',
            message: 'OTP has expired'
          }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          result: 'Success',
          message: 'OTP is valid'
        }),
      };
      // // Get a reference to the "users" collection
      // const collectionRef = db.collection("otp-requests");
  
      // // Get a document from the "users" collection
      // const docRef = collectionRef.doc(event.queryStringParameters.token);
      // docRef
      //   .get()
      //   .then(doc => {
      //     if (doc.exists) {
      //       console.log(doc.data());
      //       otpRequest = doc.data();
  
      //       var now = new Date();
      //       var otpCreatedAt = otpRequest.created_at;
  
      //       let timeDiff = Math.abs(otpCreatedAt.getTime() - now.getTime());
      //       let diffMinutes = Math.abs(Math.ceil(timeDiff / (1000 * 60)));
  
      //       if(otpRequest.otp != event.queryStringParameters.otp){
      //         callback(null, {
      //           statusCode: 400,
      //           body: JSON.stringify({
      //             result: 'Fail',
      //             message: 'Invalid OTP'
      //           })
      //         });
      //         return;
      //       }
  
      //       if(diffMinutes >= 5){
      //         callback(null, {
      //           statusCode: 410,
      //           body: JSON.stringify({
      //             result: 'Fail',
      //             message: 'OTP has expired'
      //           })
      //         });
      //         return;
      //       }
      //       callback(null, {
      //         statusCode: 200,
      //         body: JSON.stringify({
      //           result: 'Success'
      //         })
      //       });
      //     } else {
      //       console.log("No such document");
      //       callback(null, {
      //         statusCode: 401,
      //         body: JSON.stringify({
      //           result: 'Fail',
      //           message: 'Invalid token'
      //         })
      //       });
      //       return;
      //     }
      //   })
      //   .catch(error => {
      //     console.error("Error getting document:", error);
      //     callback(null, {
      //       statusCode: 500,
      //       body: JSON.stringify({
      //         result: 'Fail',
      //         message: 'Invalid token'
      //       })
      //     });
      //     return;
      //   });
  
    }else if('email' in event.queryStringParameters){

      let otp = generateOTP();
      let email = event.queryStringParameters.email;
  
      return sendOTP(email, otp)
    .then(sendOTPResult => {
        if (sendOTPResult.substring(0, 1) == "E") {
          return {
            statusCode: 500,
            body: JSON.stringify({ result: 'Fail',
            message: 'Failed to send OTP to email: ' + sendOTPResult }),
          };
        }
        token = storeOTP(otp, email, now);
        return {
          statusCode: 200,
          body: JSON.stringify({
            result: 'Success',
            token: token,
            time: now.toString()
          }),
        };
      });
  
    }else{
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          result: 'Fail'
        })
      });
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ result: 'Fail', message: error.toString() })
    };
  }
};

// exports.handler = async (event, context, callback) => {
//   // Generate OTP
//   const otp = Math.floor(Math.random() * 1000000);

//   // Send OTP to user's email
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "wetmemeslayer1@gmail.com",
//       pass: "andreridho"
//     }
//   });

//   const mailOptions = {
//     from: "wetmemeslayer1@gmail.com",
//     to: event.queryStringParameters.email,
//     subject: "OTP for your transaction",
//     text: `Your OTP is: ${otp}`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log("Error:" + error);
//     } else {
//       console.log("OTP sent: " + info.response);
//     }
//   });

//   // Compare OTP
//   const receivedOtp = event.queryStringParameters.otp;
//   let result;
//   if (receivedOtp === otp) {
//     result = "Success";
//   } else {
//     result = "Fail";
//   }

//   // Return result
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify({
//       result: result,
//       otpExpiry: 300 // 5 minutes in seconds
//     })
//   };
//   callback(null, response);
// };