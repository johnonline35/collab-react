// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const avatar_api_username = process.env.REACT_APP_AVATARAPI_USERNAME;
const avatar_api_password = process.env.REACT_APP_AVATARAPI_PASSWORD;

const workspcesAvatarApi = async (newRow) => {
  const email = newRow?.meeting_attendee_email;
  console.log("Received email:", email);

  if (!email) {
    console.log("No email was passed into the function");
    return { functionName: "workspcesAvatarApi", result: "No email" };
  }

  const { data, error } = await supabase
    .from("avatarapi_data")
    .select("email")
    .eq("email", email);

  if (error) {
    console.error(
      "Error fetching data from avatarapi_data table: ",
      error.message
    );
    throw error;
  }

  if (data.length > 0) {
    console.log(`Email ${email} already exists in the table.`);
    return {
      functionName: "workspcesAvatarApi",
      result: `Email ${email} already exists in the table.`,
    };
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

    console.log("Received response from Avatar API", response.data);

    const avatarData = Object.keys(response.data).reduce((result, key) => {
      result[key.toLowerCase()] = response.data[key];
      return result;
    }, {});

    avatarData.email = email;

    const { error: upsertError } = await supabase
      .from("avatarapi_data")
      .upsert(avatarData, { returning: "minimal" });

    if (upsertError) {
      console.log("Error upserting data:", upsertError.message);
      throw upsertError;
    }

    return response.data;
  } catch (error) {
    console.log("Error fetching avatar:", error.message);
    throw error;
  }
};

module.exports = async (req, res) => {
  try {
    const newRow = req.body;
    const result = await workspcesAvatarApi(newRow);

    res.status(200).json(result);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      functionName: "workspcesAvatarApiJob",
      error: `An error occurred: ${error.message}`,
    });
  }
};

// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const axios = require("axios");
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const { createClient } = require("@supabase/supabase-js");

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);
// const avatar_api_username = process.env.REACT_APP_AVATARAPI_USERNAME;
// const avatar_api_password = process.env.REACT_APP_AVATARAPI_PASSWORD;

// module.exports = async (req, res) => {
//   const newRow = req.body;

//   // Extract the email from the request
//   const email = newRow?.record?.meeting_attendee_email;
//   console.log("Received email:", email);

//   if (!email) {
//     console.log("Missing email in request body");
//     res.status(400).json({ error: "Missing email in request body" });
//     return;
//   }

//   // Check if email exists in the avatarapi_data table
//   const { data: existingData, error: fetchError } = await supabase
//     .from("avatarapi_data")
//     .select("email")
//     .eq("email", email);

//   if (fetchError) {
//     console.error("Error fetching data from Supabase:", fetchError);
//     res.status(500).json({ error: fetchError.message });
//     return;
//   }

//   // If the email already exists, exit the function
//   if (existingData.length > 0) {
//     console.log("Email already exists, exiting function.");
//     res.status(200).json({ message: "Email already exists." });
//     return;
//   }

//   try {
//     console.log("Making request to Avatar API...");
//     const response = await axios.post(
//       "https://avatarapi.com/v2/api.aspx",
//       {
//         username: avatar_api_username,
//         password: avatar_api_password,
//         email: email,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("Received response from Avatar API", response.data);

//     // Convert keys to lowercase
//     const avatarData = Object.keys(response.data).reduce((result, key) => {
//       result[key.toLowerCase()] = response.data[key];
//       return result;
//     }, {});

//     // Add email to the data object
//     avatarData.email = email;

//     // Insert the Avatar API response into the Supabase table
//     const { data, error } = await supabase
//       .from("avatarapi_data")
//       .upsert(avatarData, { returning: "minimal" }); // don't return the inserted row

//     if (error) {
//       console.error("Error inserting data into Supabase:", error);
//       res
//         .status(500)
//         .send(`Error inserting data into Supabase: ${error.message}`);
//     } else {
//       console.log("Data successfully inserted into Supabase.");
//       // If successful, send back the response from the Avatar API
//       res.status(200).send(response.data);
//     }
//   } catch (error) {
//     // Log the error message if the request failed
//     console.log("Error fetching avatar:", error.message);
//     res.status(500).send(`Error fetching avatar: ${error.message}`);
//   }
// };
