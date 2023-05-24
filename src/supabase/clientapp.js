import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { delete_cookie } from "../privateRoute";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogle() {
  const { user, session, error } = await supabase.auth.signInWithOAuth({
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

  if (error) {
    console.log("Login error: ", error);
    return; // Stop execution if there's a login error
  }

  const refreshToken = session.provider_refresh_token;
  console.log("refresh token:", refreshToken);

  const { data, error: upsertError } = await supabase
    .from("collab_users")
    .upsert([{ id: user.id, refresh_token: refreshToken }]);

  if (upsertError) {
    console.log("Upsert error: ", upsertError);
    return; // Stop execution if there's an upsert error
  }

  console.log("Upsert data: ", data);
}

// export async function signInWithGoogle() {
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       redirectTo: "https://www.instantcollab.co/dashboard",
//       queryParams: {
//         access_type: "offline",
//         prompt: "consent",
//         scopes: ["https://www.googleapis.com/auth/calendar.events"],
//       },
//     },
//   });

//   // const session = await supabase.auth.session();
//   // console.log(session);
// }

export async function signout() {
  const { error } = await supabase.auth.signOut();
  delete_cookie("token");
}
