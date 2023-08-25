import { parse } from "node:querystring";

export async function handler(event, context, callback) {
  let body = parse(event.body);
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
}
