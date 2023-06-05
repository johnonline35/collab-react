// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");

module.exports = async (req, res) => {
  const options = {
    method: "GET",
    url: "https://enrich.p.rapidapi.com/contact/email",
    params: {
      email: "viviana@felicis.com",
    },
    headers: {
      "X-RapidAPI-Key": "c39273e00emshe0917644628e8c9p1c4eabjsnbb871b32a325",
      "X-RapidAPI-Host": "enrich.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response); // Logging the entire response object
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
};
