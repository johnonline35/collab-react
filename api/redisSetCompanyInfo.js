// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");
const redis_url = process.env.REACT_APP_UPSTASH_REDIS_REST_URL;
const redis_token = process.env.REACT_APP_UPSTASH_REDIS_REST_TOKEN;

module.exports = async (req, res) => {
  try {
    const { userId, data } = req.body;

    console.log(`Received request to store company info for user ${userId}`);

    // Store the company info in Redis, with the key being the userId
    const response = await axios.post(
      `${redis_url}/set`,
      { key: userId, value: JSON.stringify(data) },
      {
        headers: {
          Authorization: `Bearer ${redis_token}`,
        },
      }
    );

    // Log the response status code and result of the operation
    console.log(`Response status from Redis: ${response.status}`);
    console.log(`Response data from Redis: ${JSON.stringify(response.data)}`);

    res.status(200).send("Successfully stored company info in Redis");
  } catch (error) {
    // Log the error message if something goes wrong
    console.log(`Error occurred: ${error.message}`);
    res.status(500).send("Something went wrong");
  }
};
