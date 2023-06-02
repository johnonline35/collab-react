// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const avatar_api_username = process.env.REACT_APP_AVATARAPI_USERNAME;
const avatar_api_password = process.env.REACT_APP_AVATARAPI_PASSWORD;

console.log("Avatar_api_username:", avatar_api_username);

module.exports = async (req, res) => {
  console.log("Received Request:", req.method, req.url);

  // Extract the email from the request
  const email = req.body.email;
  console.log("Received email:", email);

  if (!email) {
    console.log("Missing email in request body");
    res.status(400).json({ error: "Missing email in request body" });
    return;
  }

  try {
    console.log("Making request to Avatar API...");
    const response = await axios.post(
      "https://avatarapi.com/v2/api.aspx",
      {
        username: avatar_api_username,
        password: avatar_api_password,
        email: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Received response from Avatar API");
    // If successful, send back the response from the Avatar API
    res.status(200).send(response.data);
  } catch (error) {
    // Log the error message if the request failed
    console.log("Error fetching avatar:", error.message);
    res.status(500).send(`Error fetching avatar: ${error.message}`);
  }
};
