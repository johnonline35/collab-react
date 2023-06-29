// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");
const redis_url = process.env.REACT_APP_UPSTASH_REDIS_REST_URL;
const redis_token = process.env.REACT_APP_UPSTASH_REDIS_REST_TOKEN;

module.exports = async (req, res) => {
  try {
    const { userId } = req.query;

    // Retrieve the company info from Redis using the userId
    const response = await axios.post(
      `${redis_url}/get`,
      { key: userId },
      {
        headers: {
          Authorization: `Bearer ${redis_token}`,
        },
      }
    );

    res.status(200).send(response.data.result);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};
