// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");

module.exports = async (req, res) => {
  // Parse the request body as JSON
  const body = JSON.parse(req.body);

  // Extract newRow from the parsed body
  const newRow = body;

  // Extract domainName from newRow
  const domainName = newRow?.record?.domain;

  // Log the domainName
  console.log("Domain name: ", domainName);

  // Check if the domainName parameter is an empty string
  if (!domainName) {
    res.status(400).json({ error: "Missing domainName parameter" });
    return;
  }

  try {
    // Make a request to the Brandfetch API
    const response = await axios.get(
      `https://api.brandfetch.io/v1/brand?domainName=${domainName}`,
      {
        headers: {
          "X-API-KEY": "your_brandfetch_api_key",
        },
      }
    );

    // Send the response from the Brandfetch API
    res.status(200).send(response.data);
  } catch (error) {
    // Send an error message if the request failed
    res.status(500).send(`Error fetching brand: ${error.message}`);
  }
};
