import { supabase } from "../supabase/clientapp";
import { formatTime } from "../hooks/useFormatTime";

export const updateLexicalWithMeetingData = async (workspaceId) => {
  let jsonString =
    '{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"{workspaces.workspace_name} Meeting Notes","type":"text","version":1}],"direction":"ltr","format":"center","indent":0,"type":"heading","version":1,"tag":"h1"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"{meetings.start_datetime}","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Attendees:","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"quote","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"collab_users.collab_user_name, collab_users.collab_user_job_title","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"quote","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"attendees.attendee_name, attendees.attendee.job_title, attendees.attendee_linkedin, attendees.attendee_twitter","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"quote","version":1},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Notes:","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

  // Convert jsonString into a JavaScript object
  let jsonObj = JSON.parse(jsonString);

  // Query the workspace table for workspace name
  const { data: workspaceData, error: workspaceError } = await supabase
    .from("workspaces")
    .select("workspace_name")
    .eq("workspace_id", workspaceId)
    .single();

  if (workspaceError) throw workspaceError;

  // Replace the workspace name placeholder
  jsonObj.root.children[0].children[0].text =
    jsonObj.root.children[0].children[0].text.replace(
      "{workspaces.workspace_name}",
      `${workspaceData.workspace_name}`
    );

  // Query the meetings table for next meeting time
  const { data: meetingsData, error: meetingsError } = await supabase
    .from("meetings")
    .select("start_dateTime")
    .eq("workspace_id", workspaceId)
    .range("start_dateTime", new Date().toISOString(), null)
    .order("start_dateTime", { ascending: true })
    .limit(1)
    .single();

  if (meetingsError) {
    console.error("Error retrieving meetings:", meetingsError);
    // You could also replace the meetings.start_datetime placeholder with a default value here
    jsonObj.root.children[2].children[0].text =
      jsonObj.root.children[2].children[0].text.replace(
        "{meetings.start_datetime}",
        "No upcoming meetings scheduled"
      );
  } else if (meetingsData === null) {
    // Replace the meetings.start_datetime placeholder with a default value
    jsonObj.root.children[2].children[0].text =
      jsonObj.root.children[2].children[0].text.replace(
        "{meetings.start_datetime}",
        "No upcoming meetings scheduled"
      );
  } else {
    // Replace the meetings.start_datetime placeholder
    // const date = formatTime(meetingsData.start_dateTime);
    jsonObj.root.children[2].children[0].text =
      jsonObj.root.children[2].children[0].text.replace(
        "{meetings.start_datetime}",
        `${meetingsData.start_dateTime}`
      );
  }

  // Query the attendees table
  //   const { data: attendeesData, error: attendeesError } = await supabase
  //     .from("attendees")
  //     .select(
  //       "attendee_name, attendee.job_title, attendee_linkedin, attendee_twitter"
  //     )
  //     .eq("workspace_id", workspaceId)
  //     .eq("attendee_is_workspace_lead", true);

  //   if (attendeesError) throw attendeesError;

  //   // Replace attendees.attendee_name, attendees.attendee.job_title, attendees.attendee_linkedin, attendees.attendee_twitter in jsonObj
  //   // Here you might need to adjust the path depending on where these fields are in your JSON
  //   jsonObj.root.children[7].children[0].text =
  //     jsonObj.root.children[7].children[0].text.replace(
  //       "attendees.attendee_name, attendees.attendee.job_title, attendees.attendee_linkedin, attendees.attendee_twitter",
  //       `${attendeesData.attendee_name}, ${attendeesData.attendee.job_title}, ${attendeesData.attendee_linkedin}, ${attendeesData.attendee_twitter}`
  //     );

  // Convert jsonObj back into a JSON string
  jsonString = JSON.stringify(jsonObj);

  return jsonString;
};
