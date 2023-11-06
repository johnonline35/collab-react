import { useToast } from "@chakra-ui/react";
import { supabase } from "../supabase/clientapp";

export default async function HandleDeleteAttendees(
  workspace_id,
  setAttendeeIsChecked,
  attendeeIsChecked,
  toast
) {
  // First check if there is only one attendee in the workspace
  const { data, error } = await supabase
    .from("attendees")
    .select("*")
    .eq("workspace_id", workspace_id);

  if (error) {
    console.log("Error fetching attendees: ", error);
    // Show an error toast
    toast({
      title: "An error occurred.",
      description: `Unable to fetch the attendee(s). Error: ${error.message}`, // including error message in the description
      status: "error",
      position: "top",
      duration: 5000,
      isClosable: true,
    });

    return; // stop execution in case of error
  }

  console.log("attendeeIsChecked", attendeeIsChecked);
  console.log("data", data);

  const leadToBeDeleted = attendeeIsChecked.find(
    (id) => id === data[0].attendee_id && data[0].attendee_is_workspace_lead
  );

  if (leadToBeDeleted) {
    console.log("Lead to be deleted:", leadToBeDeleted);
    // Show an error toast
    toast({
      title: "Cannot delete workspace lead.",
      description:
        "Please assign a new workspace lead before deleting attendee.",
      status: "error",
      position: "top",
      duration: 5000,
      isClosable: true,
    });

    // Uncheck the lead by removing them from the attendeeIsChecked array
    setAttendeeIsChecked(
      attendeeIsChecked.filter((attendeeId) => attendeeId !== leadToBeDeleted)
    );

    return; // stop execution
  }

  if (data.length === attendeeIsChecked.length) {
    // Show an error toast
    toast({
      title: "Cannot delete all attendees.",
      description: "A workspace must have at least one attendee.",
      status: "error",
      position: "top",
      duration: 5000,
      isClosable: true,
    });

    return; // stop execution
  }

  // Loop over each checked attendee
  for (const attendeeId of attendeeIsChecked) {
    // Perform the updates for each attendee
    try {
      const { data, error } = await supabase
        .from("attendees")
        .update({
          ignore: true,
          workspace_id: null,
          attendee_is_workspace_lead: false,
        })
        .eq("workspace_id", workspace_id)
        .eq("attendee_id", attendeeId);

      if (error) {
        throw error;
      } else {
        console.log("Successfully updated attendee ", attendeeId);
      }
    } catch (error) {
      console.log("Error updating attendee: ", error);

      // Show an error toast
      toast({
        title: "An error occurred.",
        description: `Unable to delete the attendee(s). Error: ${error.message}`,
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });

      return; // stop execution in case of error
    }
  }

  // Clear the checked attendees state
  setAttendeeIsChecked([]);

  // Show a success toast
  toast({
    title: "Deletion Successful.",
    description: "The attendee(s) were successfully deleted",
    status: "success",
    position: "top",
    duration: 5000,
    isClosable: true,
  });
}
