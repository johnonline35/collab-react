// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.REACT_APP_UPSTASH_REDIS_REST_URL,
  token: process.env.REACT_APP_UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  const key = "mytestkey"; // Define a key

  // Set a fixed string value to the key in Upstash Redis
  await redis.set(key, "Hello from Vercel");

  // Get the value of the key from Upstash Redis
  const value = await redis.get(key);

  // Return the key and value in the response
  res.json({ key, value });
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
