import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { delete_cookie } from "../privateRoute";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogle() {
  const { session, user, error } = await supabase.auth.signInWithOAuth({
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
    console.log("Error: ", error);
  } else {
    const refreshToken = session.provider_token.refresh_token;
    console.log("refresh token:", refreshToken);
    // Then, store the refresh token into your database.
    const { data, error } = await supabase
      .from("collab_users")
      .upsert([{ id: user.id, refresh_token: refreshToken }]);
  }

  if (error) {
    console.log("Upsert error: ", error);
  }
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
