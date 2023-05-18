import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { delete_cookie } from "../privateRoute";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://www.instantcollab.co/dashboard",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
        scopes: ["https://www.googleapis.com/auth/calendar.events"],
      },
    },
  });

  // const session = await supabase.auth.session();
  // console.log(session);
}

export async function signout() {
  const { error } = await supabase.auth.signOut();
  delete_cookie("token");
}
