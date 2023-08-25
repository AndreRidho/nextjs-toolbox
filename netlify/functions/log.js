const querystring = require("node:querystring");

exports.handler = async function (event) {
  try {
    const queryParams = event.queryStringParameters;
    
    if (queryParams && "message" in queryParams) {
      console.log('message: ' + queryParams.message);
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
