const querystring = require("node:querystring");

exports.handler = async function (event) {
  try {
    let body = querystring.parse(event.body);
    
    if ("message" in body) {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: body.message,
        }),
      };
      
      console.log("Response:", response);
      
      return response;
    } else {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Missing 'message' in request body.",
        }),
      };
    }
  } catch (error) {
    console.error("Error:", error);
    
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Internal server error.",
      }),
    };
  }
};