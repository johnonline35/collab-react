import { useState, useEffect } from "react";
import { supabase } from "../supabase/clientapp";

export function useSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return;
      }

      // Check if data is not null or undefined before trying to access the session property
      if (data) {
        setSession(data.session); // Set the session with the received data
      } else {
        console.log("No active session");
      }
    };

    getSession(); // Fetch the session when the component is mounted
  }, []);

  return session;
}
