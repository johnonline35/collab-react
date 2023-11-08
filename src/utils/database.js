import { supabase } from "../supabase/clientapp";

// Define an async function to fetch data from Supabase
export const fetchLexicalMeetingData = async (
  session,
  workspace_id,
  nextMeetingId
) => {
  // const { data, error } = await supabase.auth.getSession();
  // if (error) {
  //   console.error("Error getting session:", error);
  //   return;
  // }
  //

  const userId = session?.user?.id;
  // Prepare promises for concurrent fetching
  const collabUserPromise = supabase
    .from("collab_users")
    .select("collab_user_timezone")
    .eq("id", userId)
    .single();

  const workspacePromise = supabase
    .from("workspaces")
    .select("workspace_name")
    .eq("workspace_id", workspace_id);

  const meetingsPromise = supabase
    .from("meetings")
    .select("*")
    .eq("id", nextMeetingId);

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

      detailedInfo.forEach((attendee) => {
        console.log({ meeting_attendees_array: attendee });
      });

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

export const fetchNextStepUUIDs = async (workspace_id, userId) => {
  try {
    const { data, error } = await supabase
      .from("collab_users_next_steps")
      .select("collab_user_next_steps_id")
      .match({
        workspace_id: workspace_id,
        collab_user_id: userId,
      });

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

export const fetchTodoUuids = async (workspace_id, userId) => {
  try {
    const { data, error } = await supabase
      .from("collab_users_todos")
      .select("collab_user_todo_id")
      .match({
        workspace_id: workspace_id,
        collab_user_id: userId,
      });

    if (error) {
      console.error("Error fetching UUIDs:", error);
      return null;
    }

    if (data) {
      return data.map((item) => item.collab_user_todo_id);
    }
  } catch (err) {
    console.error("Supabase fetch error:", err);
  }
  return null;
};

export const storeNextStep = async (workspace_id, userId, uuid, content) => {
  const response = await supabase.from("collab_users_next_steps").insert([
    {
      workspace_id: workspace_id,
      collab_user_id: userId,
      collab_user_next_steps_id: uuid,
      nextstep_content: content,
    },
  ]);

  if (response.error) {
    console.error("Error storing next step:", response.error);
    return {
      success: false,
    };
  } else {
    return {
      success: response.status === 201,
    };
  }
};

export const storeTodo = async (workspace_id, userId, uuid, content) => {
  const response = await supabase.from("collab_users_todos").insert([
    {
      workspace_id: workspace_id,
      collab_user_id: userId,
      collab_user_todo_id: uuid,
      todo_content: content,
    },
  ]);

  if (response.error) {
    console.error("Error storing Todo:", response.error);
    return {
      success: false,
    };
  } else {
    return {
      success: response.status === 201,
    };
  }
};

export async function storeRefreshToken(userId, refreshToken) {
  const { error: upsertError } = await supabase
    .from("collab_users")
    .upsert([{ id: userId, refresh_token: refreshToken }], {
      onConflict: "id",
    });

  if (upsertError) {
    console.error("Error upserting refresh token:", upsertError);
  }
  console.log("After calling the async function");
}

export async function fetchWorkspaces(userId) {
  try {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("collab_user_id", userId);

    if (error) {
      throw error;
    }
    console.log("fetchWorkspaces Data:", data);
    return data || [];
  } catch (err) {
    console.error("Error fetching workspaces:", err);
    return [];
  }
}

export const getCompanyTileInfo = async (userId) => {
  try {
    const { data, error } = await supabase.rpc("new_test_dashboard", {
      _userid: userId,
    });

    if (error) {
      console.error("Error fetching data:", error);
    }

    console.log("datanewtestdasboard:", data);
    return data;
  } catch (error) {
    console.error("Error in test_dashboard:", error);
  }
};

export async function fetchWorkspaceName(userId, workspace_id) {
  console.log("fetchWorkspaceName(userId, workspace_id)", userId, workspace_id);
  try {
    const { data, error } = await supabase
      .from("workspaces")
      .select("workspace_name")
      .match({
        workspace_id: workspace_id,
        collab_user_id: userId,
      });

    if (error) {
      throw error;
    }
    console.log("fetchWorkspaces Name:", data[0].workspace_name);
    return data[0].workspace_name;
  } catch (err) {
    console.error("Error fetching workspaces:", err);
  }
}
