import { supabase } from "../supabase/clientapp";
import { FetchWrapper } from "./helper";

// Define an async function to fetch data from Supabase
export const fetchLexicalMeetingData = async (workspace_id) => {
  const now = new Date().toISOString(); // Get current time in ISO format

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    return;
  }

  // Define promises to fetch required data
  const promises = [
    supabase
      .from("collab_users")
      .select("collab_user_timezone")
      .eq("collab_user_email", data.session.user.email)
      .single(),

    supabase
      .from("workspaces")
      .select("workspace_name")
      .eq("workspace_id", workspace_id),

    supabase
      .from("meetings")
      .select("*")
      .eq("workspace_id", workspace_id)
      .gte("start_dateTime", now)
      .order("start_dateTime", { ascending: true }),
  ];

  // Fetch all required data in parallel
  const [collabUser, workspaces, meetings] = await FetchWrapper(promises);

  const workspaceName = workspaces[0].workspace_name;

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
          "attendee_name, attendee_job_title, attendee_linkedin, attendee_twitter, job_company_linkedin_url, job_company_twitter_url, attendee_domain"
        )
        .eq("attendee_email", attendee.email);

      return detailedInfo[0]; // Assuming detailedInfo is an array and you need the first item
    })
  );

  // Construct meeting data object
  const meetingDetails = {
    workspaceName: workspaceName,
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
