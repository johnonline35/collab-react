// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.REACT_APP_UPSTASH_REDIS_REST_URL,
  token: process.env.REACT_APP_UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  try {
    const key = "myKey";
    const value = "myValue";

    console.log(`Received request to store key-value pair: ${key} - ${value}`);

    // Store the key-value pair in Redis
    await redis.set(key, value);

    console.log(`Successfully stored key-value pair in Redis`);

    // Close the connection to the Redis instance
    await redis.disconnect();

    res.status(200).send("Successfully stored key-value pair in Redis");
  } catch (error) {
    // Log the error message if something goes wrong
    console.error(`Error occurred: ${error.message}`);
    console.error(error);

    res.status(500).send("Something went wrong");
  }
};

// module.exports = async (req, res) => {
//   try {
//     const { userId, data } = req.body;

//     // console.log(`Received request to store company info for user ${userId}`);
//     // console.log(`Data to be stored in Redis: ${JSON.stringify(data)}`);

//     // Set the company info in Redis using the JSON path and optional parameters
//     const response = await redis.json.set(
//       userId,
//       "$.path",
//       JSON.stringify(data),
//       { nx: true }
//     );

//     console.log(`Response from Redis set operation: ${response}`);

//     // Log the response status code and result of the operation
//     console.log(`Response status from Redis: ${response}`);
//     console.log(`Response data from Redis: ${JSON.stringify(response)}`);

//     // Close the connection to the Redis instance
//     await redis.disconnect();

//     res.status(200).send("Successfully stored company info in Redis");
//   } catch (error) {
//     // Log the error message if something goes wrong
//     console.error(`Error occurred: ${error.message}`);
//     console.error(error);

//     res.status(500).send("Something went wrong");
//   }
// };
