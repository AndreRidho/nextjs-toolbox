export default async function handler(req, res) {
  try {
    console.log(new Date(), "Start ping");
    await fetch("https://hirfa-api.onrender.com/");
    console.log(new Date(), "End ping");
  } catch (error) {
    console.log(new Date(), "Error:", error);
  }
}


export const config = {
    schedule: "*/10 * * * *"
}