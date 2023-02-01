

// const otpExpiry = 300000; // 5 minutes in milliseconds

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCcPW6LgKrQmZELR6CTf49fZcVNKD7SHYc",
//   authDomain: "atm-serverless.firebaseapp.com",
//   projectId: "atm-serverless",
//   storageBucket: "atm-serverless.appspot.com",
//   messagingSenderId: "1076969212972",
//   appId: "1:1076969212972:web:3cabd986aeb4852e4f5589"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
const nodemailer = require("nodemailer");
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

initializeApp();

const db = getFirestore();

function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "wetmemeslayer1@gmail.com",
      pass: "andreridho"
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

async function storeOTP(otp){

  const now = new Date();

  let token = generateRandomString(100);

  const docRef = db.collection('otp-requests').doc(token);

  await docRef.set({
    otp: otp,
    created_at: now,
  });

  return token;

}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

exports.handler = async function(event, context, callback) {

  if('email' in event.queryStringParameters){

    let otp = Math.floor(Math.random() * 1000000);

    sendOTP(event.queryStringParameters.email, otp)
    .then(sendOTPResult => {
      if (sendOTPResult.substring(0, 1) === "E") {
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({
            result: 'Fail',
            message: 'Failed to send OTP to email: ' + sendOTPResult
          })
        });
        return;
      }
      let token = storeOTP(otp);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          result: 'Success',
          token: token
        })
      });
    });

  }else if('otp' in event.queryStringParameters && 'token' in event.queryStringParameters){

    // Get a reference to the "users" collection
    const collectionRef = db.collection("otp-requests");

    // Get a document from the "users" collection
    const docRef = collectionRef.doc(event.queryStringParameters.token);
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log(doc.data());
          otpRequest = doc.data();

          var now = new Date();
          var otpCreatedAt = otpRequest.created_at;

          let timeDiff = Math.abs(otpCreatedAt.getTime() - now.getTime());
          let diffMinutes = Math.abs(Math.ceil(timeDiff / (1000 * 60)));

          if(otpRequest.otp != event.queryStringParameters.otp){
            callback(null, {
              statusCode: 400,
              body: JSON.stringify({
                result: 'Fail',
                message: 'Invalid OTP'
              })
            });
            return;
          }

          if(diffMinutes >= 5){
            callback(null, {
              statusCode: 410,
              body: JSON.stringify({
                result: 'Fail',
                message: 'OTP has expired'
              })
            });
            return;
          }
          callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              result: 'Success'
            })
          });
        } else {
          console.log("No such document");
          callback(null, {
            statusCode: 401,
            body: JSON.stringify({
              result: 'Fail',
              message: 'Invalid token'
            })
          });
          return;
        }
      })
      .catch(error => {
        console.error("Error getting document:", error);
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({
            result: 'Fail',
            message: 'Invalid token'
          })
        });
        return;
      });

  }else{
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        result: 'Fail'
      })
    });
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