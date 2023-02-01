

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
const firebaseConfig = {
  apiKey: "AIzaSyCcPW6LgKrQmZELR6CTf49fZcVNKD7SHYc",
  authDomain: "atm-serverless.firebaseapp.com",
  projectId: "atm-serverless",
  storageBucket: "atm-serverless.appspot.com",
  messagingSenderId: "1076969212972",
  appId: "1:1076969212972:web:3cabd986aeb4852e4f5589"
};
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');

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

async function storeOTP(otp, db){

  const now = new Date();

  let token = generateRandomString(100);

  const docRef = db.collection('otp-requests').doc(token);

  await docRef.set({
    otp: otp,
    created_at: now,
  });

  docRef
        .get()
        .then(doc => {
          if (doc.exists) {  

            return {
              statusCode: 200,
              body: JSON.stringify({ result: '1',
              token: token }),
            };
          } else {
            console.log("No such document");
            return {
              statusCode: 200,
              body: JSON.stringify({ result: '2',
              token: token }),
            };
          }
        })
        .catch(error => {
          console.error("Error getting document:", error);
          return {
            statusCode: 200,
            body: JSON.stringify({ result: '3',
            token: token }),
          };
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

function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

exports.handler = async function(event, context, callback) {

  try {
    
    admin.initializeApp({
      credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "atm-serverless",
        "private_key_id": "c3df1f87cd6b5cca62f592b6508f2d89fda1d5c0",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDSupoiK6Apy2WL\navM/AFpW2yDhsyQ7FVCqSUCoIOKd6aaEJaYh881ijL904gWptHChVt2qdL929awT\n+sae5xaDAwNrqLbhMuGqv1T1jFlchYxrC2Vz4FoF5bxjZW55aJCnSTP9n8stnFRO\nTqIRDAsyt5Abudj8uPtSyNniHUb/iOreoNws9i5EIFVgdCyHuX6rJOqqYuXU3l1/\nVWMtkBiWM6gt/4XhUSTfW3ALuIcHbXRrQnm+q3O410F+orYeZq5AGX771m2zsOgf\nlNn4zoetPsYnoO1jJA4iR+CVrFC9OporOjbZVu+i+AFgm/a6tHSVe8CZVCWTGmzr\nEpiYkx4jAgMBAAECggEACyn3oHfPNGeiKZCw8lWCc7eINmzXLooii+L1mfKkDtmi\nCL413vabmuz596dBxYvZq7J+a9lji1nYk/ZlL2Xuu2IdfEaj6apYakNYrOmSkmRA\n3CruZQUtv8I8CMgG4ke34iTurDEbAn+Vt9BSpbSNo1I2QEHITRs/tVMOt/v1FvSB\nYLgyyx9j6yHQhRk/vdgD7PcwZOZPkf74NScW0yiU3x9rUl+13nJWf4G1IlCydRPk\nKnHTtfTMMDCsy3oPhyNAODjmiXcAyQQdNFnxyCKy8fDh2UVlfpDDqmtRitLFCBbL\nXsKScQPDNLE+lenydgjuLGxXLOCO9xgmpvUE0aJ5gQKBgQDo/+QwiP0gRIxIXxVn\nlYb5VW7sWH8VtbrBaftx2yZbyOgFA5qlXmlC55mmnbzx6v+HGV3fVQNXIQqF1z0h\nGCGcmgTyNlxZlQ1MAZx5GZ2ze2p/QQWdlwXDPfNrpLRNdGcw2o426lS4t/qXi+AW\n17/AYRBkx/SN0qtKVXQtjPTppwKBgQDnh+k9rm3rArHdToL73r/1CpGd3vZb5XC4\nF8M8EZJvjUYl+5JHSH6F0DiYw6wwaKSxRtVnHFjpf0G/eg/UpCXaiRguOBdn4O6n\nSkXJtr/wKnf6pl4OntPOMkQ9CprTS343W3DsyyjVjqSxRC2wsu1QtpfsPoR4g75X\nvN5vRhD/JQKBgCfs4U8nyigjVt533JUZXD2RVCaPq4cu0sedv4ZtBQ+pR4jEa1V2\n7haW1Q9l7CCQIiUmRZ2lVaMyeDki/siS9/97rOlMQ1reXZ7uj794kjtVJJSVsb6l\nSEmCbhm96V90WNJYQRJL6SSV8gzR3R5M7gCrIUIDuXYr6UodhoDfrH/1AoGBAKQH\nd8jJMPpUOGqPWuDSGLCjwjJUabkFPexOeXSvBk2ditsR9boms+xdbhtcVTseh79I\nbZvVS3BxRcU/1sNRX7gJdGYaOwrPIoTGa9bSb/zYOZQMFYrKH0hv+EQ+pR2Y2Fyj\nncdEzzMtEaS8ppoOyW5rTgqC6BrxSwKhvfybaSM5AoGBAJhzSTl+ow2ecFFjuvfW\nkV+D8OJGmbrD6Xj0WdgEDjS+Q+0RHZxRzUSgsxpO9i7cXhCq0sEPrRMjFKk3as82\n9pCDlhEoO+gcNTQdbJgBgUYAz9rGU2L29bqGqTeCi8UczZ3jyYRfQljmikJjd7qA\nxd4lIienCCTYQE+RyqcjLBaw\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-sgnr4@atm-serverless.iam.gserviceaccount.com",
        "client_id": "101194411141745508686",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-sgnr4%40atm-serverless.iam.gserviceaccount.com"
      }
      ),
    });

    // Get a reference to the Cloud Firestore
    const db = admin.firestore();

    if('email' in event.queryStringParameters){

      let otp = generateOTP();
  
      return sendOTP(event.queryStringParameters.email, otp)
    .then(sendOTPResult => {
      if (sendOTPResult.substring(0, 1) == "E") {
        return {
          statusCode: 500,
          body: JSON.stringify({ result: 'Fail',
          message: 'Failed to send OTP to email: ' + sendOTPResult }),
        };
      }
      return storeOTP(otp, db);
      return {
        statusCode: 200,
        body: JSON.stringify({ result: 'Success',
        token: token }),
      };
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