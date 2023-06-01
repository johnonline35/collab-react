// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const brandfetch_api_key = process.env.REACT_APP_BRANDFETCH;

console.log(
  "Environment Variables:",
  supabaseUrl,
  supabaseAnonKey,
  brandfetch_api_key
);

module.exports = async (req, res) => {
  // Extract newRow from the parsed body
  const newRow = req.body;

  // Extract domainName from newRow
  const domainName = newRow?.record?.domain;

  // Log the domainName
  console.log("Domain name: ", domainName);

  // Check if the domainName parameter is an empty string
  if (!domainName) {
    res.status(400).json({ error: "Missing domainName parameter" });
    console.log("No domain name was passed into the function");
    return;
  }

  // Check if the domain name exists in the brandfetch_data table
  const { data, error } = await supabase
    .from("brandfetch_data")
    .select("domain")
    .eq("domain", domainName);

  if (error) {
    console.log(
      "Error fetching data from brandfetch_data table: ",
      error.message
    );
    res.status(500).json({ error: error.message });
    return;
  }

  console.log("Supabase Data:", data);

  // If the domain exists in the table, return without doing anything
  if (data.length > 0) {
    console.log(`Domain name ${domainName} already exists in the table.`);
    res.status(200).json({
      message: `Domain name ${domainName} already exists in the table.`,
    });
    return;
  }

  // If there is a domain and it doesn't exist in the brandfetch table, then retrieve it
  try {
    // Make a request to the Brandfetch API
    const response = await axios.get(
      `https://api.brandfetch.io/v2/brands/${domainName}`,
      {
        headers: {
          "X-API-KEY": brandfetch_api_key,
        },
      }
    );

    console.log("Brandfetch Response:", response.data);

    // Send the response from the Brandfetch API
    res.status(200).send(response.data);
  } catch (error) {
    // Log the error message if the request failed
    console.log("Error fetching brand:", error.message);
    res.status(500).send(`Error fetching brand: ${error.message}`);
  }
};
