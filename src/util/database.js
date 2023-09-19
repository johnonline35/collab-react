import { supabase } from "../supabase/clientapp";

// Define an async function to fetch data from Supabase
export const fetchLexicalMeetingData = async (workspace_id) => {
  const now = new Date().toISOString(); // Get current time in ISO format

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error);
    return;
  }

  const userEmail = data.session.user.email;

  // Prepare promises for concurrent fetching
  const collabUserPromise = supabase
    .from("collab_users")
    .select("collab_user_timezone")
    .eq("collab_user_email", userEmail)
    .single();

  const workspacePromise = supabase
    .from("workspaces")
    .select("workspace_name")
    .eq("workspace_id", workspace_id);

  const meetingsPromise = supabase
    .from("meetings")
    .select("*")
    .eq("workspace_id", workspace_id)
    .gte("start_dateTime", now)
    .order("start_dateTime", { ascending: true });

  const [collabUser, workspaces, meetings] = await Promise.all([
    collabUserPromise,
    workspacePromise,
    meetingsPromise,
  ]);

  // Check if meetings is empty or undefined
  if (!meetings.data || meetings.data.length === 0) {
    console.log("No meetings found for workspace_id:", workspace_id);
    return; // or handle this situation as needed
  }

  const nextMeeting = meetings.data[0];
  const nextMeetingDate = nextMeeting.start_dateTime;

  // Fetch meeting attendees using meetings.id
  let { data: attendees } = await supabase
    .from("meeting_attendees")
    .select("*")
    .eq("meeting_id", nextMeeting.id);

  // Map attendees data to gather required details
  const detailedAttendees = await Promise.all(
    attendees.map(async (attendee) => {
      let { data: detailedInfo } = await supabase
        .from("attendees")
        .select(
          "attendee_name, attendee_email, attendee_job_title, attendee_linkedin, attendee_twitter, job_company_linkedin_url, job_company_twitter_url, attendee_domain, attendee_is_workspace_lead"
        )
        .eq("attendee_email", attendee.email);

      return detailedInfo[0]; // Assuming detailedInfo is an array and you need the first item
    })
  );

  // Construct meeting data object
  const meetingDetails = {
    workspaceName: workspaces.data[0].workspace_name,
    nextMeetingDate: nextMeetingDate,
    attendees: detailedAttendees,
    user_timezone: collabUser.data.collab_user_timezone,
  };

  console.log("meetingDetails:", meetingDetails);

  return [meetingDetails]; // Assuming you want an array containing the next meeting details
};

export const updateAttendee = async (id, updates) => {
  const { data, error } = await supabase
    .from("attendees")
    .update(updates)
    .eq("attendee_id", id);

  if (error) {
    console.error("Error updating attendee info:", error);
  }
};

export const publicEmailDomainsList = async () => {
  const { data, error } = await supabase
    .from("public_email_domains")
    .select("domain");

  if (error) {
    console.error("Error fetching domains: ", error);
    return;
  }

  // Assuming 'domain' is a column in your table
  const publicEmailDomains = data.map((row) => row.domain);

  return publicEmailDomains;
};

export const fetchUUIDs = async (workspace_id, userId) => {
  try {
    const { data, error } = await supabase
      .from("collab_users_next_steps")
      .select("collab_user_next_steps_id")
      .match({
        workspace_id: workspace_id,
        collab_user_id: userId,
      });

    console.log("Data:", data);

    if (error) {
      console.error("Error fetching UUIDs:", error);
      return null;
    }

    if (data) {
      return data.map((item) => item.collab_user_next_steps_id);
    }
  } catch (err) {
    console.error("Supabase fetch error:", err);
  }
  return null;
};

export const storeNextStep = async (workspace_id, userId, uuid, content) => {
  const { data, error } = await supabase
    .from("collab_users_next_steps")
    .insert([
      {
        workspace_id: workspace_id,
        collab_user_id: userId,
        collab_user_next_steps_id: uuid,
        nextstep_content: content,
      },
    ])
    .single();

  if (error) {
    console.error("Error storing next step:", error);
    return null;
  } else {
    console.log("Returned data from Supabase:", data);
  }
  return null;
};
