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

      setSession(data.session); // Set the session with the received data
    };

    getSession(); // Fetch the session when the component is mounted
  }, []);

  return session;
}
