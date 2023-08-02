import { supabase } from "../supabase/clientapp";

export const updateAttendee = async (id, updates) => {
  const { data, error } = await supabase
    .from("attendees")
    .update(updates)
    .eq("attendee_id", id);

  if (error) {
    console.error("Error updating attendee info:", error);
  }
};
