// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createJobRecord(collabUserId) {
  console.log("Attempting to upsert new job into job_queue...");
  // Upsert a new row into the job_queue table
  const { data: upsertData, error: upsertJobError } = await supabase
    .from("job_queue")
    .upsert(
      [
        {
          collab_user_id: collabUserId,
          job_started: true,
          job_name: "load_dashboard",
          api_name: "brandFetch",
        },
      ],
      {
        onConflict: "job_id",
        returning: "representation",
      }
    )
    .select();

  if (upsertJobError) {
    console.log("Error upserting job:", upsertJobError);
    throw upsertJobError;
  }

  return upsertData[0].job_id;
}

async function updateJobRecord(jobId) {
  // Update the job_queue table to 'job_complete' once the function execution is finished
  await supabase
    .from("job_queue")
    .upsert([{ job_id: jobId, job_complete: true }], {
      onConflict: "job_id",
    });
}

module.exports = async (req, res) => {
  try {
    // Extract newRow from the parsed body
    const newRow = req.body;

    const collabUserId = newRow?.record?.collab_user_id;

    const jobId = await createJobRecord(collabUserId);

    const function1Url = "https://www.instantcollab.co/api/brandFetch";
    // const function2Url = "https://your-vercel-endpoint.com/function2";
    // const function3Url = "https://your-vercel-endpoint.com/function3";

    const jobs = [
      axios.post(function1Url, newRow),
      //   axios.post(function2Url, newRow),
      //   axios.post(function3Url, newRow),
    ];

    const results = await Promise.allSettled(jobs);

    // Handle results here...
    for (const result of results) {
      if (result.status === "fulfilled") {
        console.log("Fulfilled with value:", result.value);
      } else {
        console.log("Rejected with reason:", result.reason);
      }
    }

    await updateJobRecord(jobId);

    // Send the results or errors back in the response.
    res.status(200).send(results);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send(`An error occurred: ${error.message}`);
  }
};
