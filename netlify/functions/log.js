exports.handler = async function (event, context, callback) {
//   return {
//     statusCode: 400,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       result: "Fail",
//       message: "Invalid request",
//     }),
//   };

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      result: "Success",
      message: "OTP is valid",
    }),
  };
};