// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.REACT_APP_UPSTASH_REDIS_REST_URL,
  token: process.env.REACT_APP_UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  try {
    const { userId, data } = req.body;

    console.log(`Received request to store company info for user ${userId}`);

    // Store the company info in Redis, with the key being the userId
    const response = await redis.set(userId, JSON.stringify(data));

    // Log the response status code and result of the operation
    console.log(`Response status from Redis: ${response}`);
    console.log(`Response data from Redis: ${JSON.stringify(response)}`);

    // Close the connection to the Redis instance
    await redis.disconnect();

    res.status(200).send("Successfully stored company info in Redis");
  } catch (error) {
    // Log the error message if something goes wrong
    console.log(`Error occurred: ${error.message}`);

    res.status(500).send("Something went wrong");
  }
};
