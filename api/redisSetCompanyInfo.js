// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Redis } = require("@upstash/redis");

// Define a simple test function
module.exports = async (req, res) => {
  const redis = new Redis({
    url: "https://thankful-hen-40789.upstash.io",
    token:
      "AZ9VACQgYjdhOTZlYmMtM2U4Ny00MGEzLWI5ZDctNTg1MzY4NDM2NjdmMDNjZjA4ODMzODliNGIyYzlmZTU1NjBlY2Q2YjliNDM=",
  });

  try {
    const pingResponse = await redis.ping();
    console.log("PING response:", pingResponse);
  } catch (err) {
    console.error("Error while trying to PING Redis:", err);
  }

  // const data = await redis.set("foo", "bar");
  // console.log("Response from redis.set():", data);
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
