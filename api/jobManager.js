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
          api_name: "jobManager",
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

async function updateJobRecord(jobId, results) {
  // Update the job_queue table to 'job_complete' and 'response' once the function execution is finished
  await supabase.from("job_queue").upsert(
    [
      {
        job_id: jobId,
        job_complete: true,
        response: JSON.stringify(results),
      },
    ],
    {
      onConflict: "job_id",
    }
  );
}

module.exports = async (req, res) => {
  console.log("Job Manager API Called with the req.body:", req.body);
  try {
    // Extract newRow from the parsed body
    const newRow = req.body;

    const collabUserId = newRow?.collab_user_id;

    const jobId = await createJobRecord(collabUserId);

    // Relevant supabase table: "attendees", and webhook name: attendees_table_job_manager
    const attendeesAvatarApi =
      "https://www.instantcollab.co/api/attendeesAvatarApi";

    // Relevant supabase table: "workspaces", and webhook name: workspaces_table_job_manager
    const workspacesBrandFetchApi =
      "https://www.instantcollab.co/api/brandFetch";
    const workspacesAvatarApi =
      "https://www.instantcollab.co/api/workspacesAvatarApi";
    const pdlEmailOnlyPersonApi =
      "https://www.instantcollab.co/api/pdlEmailOnlyPersonApi";
    const pdlDomainOnlyPersonApi =
      "https://www.instantcollab.co/api/pdlDomainOnlyPersonApi";

    const jobs = [
      axios.post(workspacesBrandFetchApi, newRow),
      axios.post(attendeesAvatarApi, newRow),
      axios.post(workspacesAvatarApi, newRow),
      axios.post(pdlEmailOnlyPersonApi, newRow),
      axios.post(pdlDomainOnlyPersonApi, newRow),
    ];

    const results = await Promise.allSettled(jobs);

    // Handle results here...
    const sanitizedResults = results.map((result) => {
      if (result.status === "fulfilled") {
        console.log("Fulfilled with value:", result.value.data);
        return { status: "fulfilled", value: result.value.data };
      } else {
        console.log("Rejected with reason:", result.reason);
        return { status: "rejected", reason: result.reason.message };
      }
    });

    await updateJobRecord(jobId, sanitizedResults);

    // Send the results or errors back in the response.
    res.status(200).send(sanitizedResults);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send(`An error occurred: ${error.message}`);
  }
};
