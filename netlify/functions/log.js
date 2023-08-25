const querystring = require("node:querystring");

exports.handler = async function (event, context, callback) {
  let body = querystring.parse(event.body);
  if ("message" in body) {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: body.message,
      }),
    };
  }
};
