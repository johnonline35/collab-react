// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Redis } = require("@upstash/redis");

// Define a simple test function
module.exports = async (req, res) => {
  const redis = new Redis({
    url: process.env.REACT_APP_UPSTASH_REDIS_REST_URL,
    token: process.env.REACT_APP_UPSTASH_REDIS_REST_TOKEN,
  });

  console.log(
    "Redis client has been created",
    process.env.REACT_APP_UPSTASH_REDIS_REST_URL,
    process.env.REACT_APP_UPSTASH_REDIS_REST_TOKEN
  );

  try {
    console.log("Attempting to set value in Redis");

    // Try to set a value in Redis
    await redis.set("testKey", "testValue");

    console.log("Value has been set in Redis");

    // Try to get the value we just set
    const value = await redis.get("testKey");

    console.log("Got value from Redis:", value);

    // If we got here without any errors, return the value we got from Redis
    res.json({ value });
  } catch (error) {
    // If there was an error, log it and return an error response
    console.error("Error connecting to Redis:", error);
    res.status(500).json({ error: "Error connecting to Redis" });
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
