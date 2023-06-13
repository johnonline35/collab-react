// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const brandfetch_api_key = process.env.REACT_APP_BRANDFETCH;

module.exports = async (req, res) => {
  // Extract newRow from the parsed body
  const newRow = req.body;

  // Extract domainName from newRow
  const domainName = newRow?.record?.domain;

  // extract collab_user_id from the request body
  const collabUserId = newRow?.record?.collab_user_id;

  let jobId;

  try {
    // Upsert a new row into the job_queue table
    const { data: upsertData, error: upsertJobError } = await supabase
      .from("job_queue")
      .upsert([{ collab_user_id: collabUserId, status: "job_started" }], {
        onConflict: "job_id",
      });

    if (upsertJobError) {
      console.error("Error upserting job:", upsertJobError);
      res.status(500).send({ error: upsertJobError.message });
      return;
    }
    // Set the jobId
    jobId = upsertData[0].job_id;
    console.log("Set jobId:", jobId);
    // Log the domainName
    console.log("Domain name: ", domainName);

    // Check if the domainName parameter is an empty string
    if (!domainName) {
      console.log("No domain name was passed into the function");
      res.status(400).json({ error: "Missing domainName parameter" });
      return;
    }

    // Check if the domain name exists in the brandfetch_data table
    const { data, error } = await supabase
      .from("brandfetch_data")
      .select("domain")
      .eq("domain", domainName);

    if (error) {
      console.error(
        "Error fetching data from brandfetch_data table: ",
        error.message
      );
      res.status(500).json({ error: error.message });
      return;
    }

    // If the domain exists in the table, return without doing anything
    if (data.length > 0) {
      console.log(`Domain name ${domainName} already exists in the table.`);
      res.status(200).json({
        message: `Domain name ${domainName} already exists in the table.`,
      });
      return;
    }

    // Make a request to the Brandfetch API
    console.log("Making request to Brandfetch API");
    const response = await axios.get(
      `https://api.brandfetch.io/v2/brands/${domainName}`,
      {
        headers: {
          Authorization: `Bearer ${brandfetch_api_key}`,
        },
      }
    );

    console.log("Brandfetch Response:", response.data);

    // Upsert the response data into the brandfetch_data table
    const { error: upsertBrandError } = await supabase
      .from("brandfetch_data")
      .upsert(response.data, { returning: "minimal" }); // don't return the inserted row

    if (upsertBrandError) {
      console.log("Error upserting data:", upsertBrandError.message);
      res
        .status(500)
        .send(`Error upserting brand data: ${upsertBrandError.message}`);
      return;
    }

    console.log("Upsert into brandfetch_data successful");

    // Send the response from the Brandfetch API
    res.status(200).send(response.data);
  } catch (error) {
    // Log the error message if the request failed
    console.log("Error fetching brand:", error.message);
    res.status(500).send(`Error fetching brand: ${error.message}`);
  } finally {
    // Update the job_queue table to 'job_complete' once the function execution is finished
    if (jobId) {
      await supabase
        .from("job_queue")
        .update([{ status: "job_complete" }])
        .eq("job_id", jobId);
    }
  }
};

// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const axios = require("axios");
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const { createClient } = require("@supabase/supabase-js");

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);
// const brandfetch_api_key = process.env.REACT_APP_BRANDFETCH;

// module.exports = async (req, res) => {
//   // Extract newRow from the parsed body
//   const newRow = req.body;

//   // Extract domainName from newRow
//   const domainName = newRow?.record?.domain;

//   // Log the domainName
//   console.log("Domain name: ", domainName);

//   // Check if the domainName parameter is an empty string
//   if (!domainName) {
//     res.status(400).json({ error: "Missing domainName parameter" });
//     console.log("No domain name was passed into the function");
//     return;
//   }

//   // Check if the domain name exists in the brandfetch_data table
//   const { data, error } = await supabase
//     .from("brandfetch_data")
//     .select("domain")
//     .eq("domain", domainName);

//   if (error) {
//     console.error(
//       "Error fetching data from brandfetch_data table: ",
//       error.message
//     );
//     res.status(500).json({ error: error.message });
//     return;
//   }

//   // If the domain exists in the table, return without doing anything
//   if (data.length > 0) {
//     console.log(`Domain name ${domainName} already exists in the table.`);
//     res.status(200).json({
//       message: `Domain name ${domainName} already exists in the table.`,
//     });
//     return;
//   }

//   // If there is a domain and it doesn't exist in the brandfetch table, then retrieve it
//   try {
//     // Make a request to the Brandfetch API
//     const response = await axios.get(
//       `https://api.brandfetch.io/v2/brands/${domainName}`,
//       {
//         headers: {
//           Authorization: `Bearer ${brandfetch_api_key}`,
//         },
//       }
//     );

//     console.log("Brandfetch Response:", response.data);

//     // Upsert the response data into the brandfetch_data table
//     const { error: upsertError } = await supabase
//       .from("brandfetch_data")
//       .upsert(response.data, { returning: "minimal" }); // don't return the inserted row

//     if (upsertError) {
//       console.log("Error upserting data:", upsertError.message);
//       res
//         .status(500)
//         .send(`Error upserting brand data: ${upsertError.message}`);
//       return;
//     }

//     // Send the response from the Brandfetch API
//     res.status(200).send(response.data);
//   } catch (error) {
//     // Log the error message if the request failed
//     console.log("Error fetching brand:", error.message);
//     res.status(500).send(`Error fetching brand: ${error.message}`);
//   }
// };
