const querystring = require("node:querystring");

exports.handler = async function (event) {
  try {
    const queryParams = event.queryStringParameters;
    
    if (queryParams && "message" in queryParams) {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: queryParams.message,
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
          error: "Missing 'message' query parameter.",
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
