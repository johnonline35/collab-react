import isEqual from "lodash.isequal";
import React, { useEffect, useState, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/LazyLoadDashboard";

// layouts and pages
import RootLayout from "./layouts/RootLayout";

// import { tasksLoader } from "./pages/Dashboard";
import MasterTodoList, { createAction } from "./pages/MasterTodoList";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Privacy from "./pages/compliance/Privacy";
import TermsOfService from "./pages/compliance/TermsOfService";
import CollabPageTeam from "./pages/collabs/CollabPageTeam";
import CollabPageHome from "./pages/collabs/CollabPageHome";
import CollabPageAllAttachments from "./pages/collabs/CollabPageAllAttachments";
import CollabPageShowcase from "./pages/collabs/CollabPageShowcase";
import CollabPageNotes from "./pages/collabs/CollabPageNotes";

// import { supabase } from "./supabase/clientapp";
import { createCookie, PrivateRoute, SessionContext } from "./privateRoute";
import { supabase } from "./supabase/clientapp";
import { storeRefreshToken } from "./utils/database";

import { useRecoilState } from "recoil";
import {
  avatarState,
  companyNameState,
  userNameState,
} from "./atoms/avatarAtom";

function Router() {
  const [session, setSession] = useState(null);
  const [avatar, setAvatar] = useRecoilState(avatarState);
  const [userName, setUserName] = useRecoilState(userNameState);
  const [companyName, setCompanyName] = useRecoilState(companyNameState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSessionCreateCookieStoreToken() {
      const {
        data: { session: newSession },
      } = await supabase.auth.getSession();

      if (newSession) {
        createCookie("token", newSession.access_token, newSession.expires_in);
        const userId = newSession?.user.id;
        const refreshToken = newSession?.provider_refresh_token;
        await storeRefreshToken(userId, refreshToken);

        if (!isEqual(newSession, session)) {
          setSession(newSession);
        }
      }
    }

    getSessionCreateCookieStoreToken();
  }, [session]);

  const memoizedSession = useMemo(() => session, [session]);
  const userEmail = useMemo(() => session?.user?.email, [session]);
  const userId = useMemo(() => session?.user?.id, [session]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("collab_users")
          .select("collab_user_avatar_url, collab_user_name, company_name")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }

        if (data) {
          setAvatar(data.collab_user_avatar_url); // Update Recoil state
          setUserName(data.collab_user_name);
          setCompanyName(data.company_name);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, setAvatar, setCompanyName, setUserName]);

  return (
    <SessionContext.Provider value={memoizedSession}>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/termsofservice' element={<TermsOfService />} />

        {/* Wrap PrivateRoute and RootLayout around the child routes */}
        <Route
          element={
            <PrivateRoute>
              <RootLayout
                userEmail={userEmail}
                userId={userId}
                avatar={avatar}
                userName={userName}
                companyName={companyName}
                loading={loading}
              />
            </PrivateRoute>
          }
        >
          {/* Child routes for /collabs */}
          <Route
            path='collabs/:workspace_id'
            element={<CollabPageHome userId={userId} />}
          >
            <Route
              path=':collab_user_note_id'
              element={<CollabPageNotes userId={userId} />}
            />
            <Route path='team' element={<CollabPageTeam />} />
            <Route path='share' element={<CollabPageShowcase />} />
            <Route path='files' element={<CollabPageAllAttachments />} />
          </Route>

          {/* Child routes for /dashboard */}
          <Route path='dashboard' element={<Dashboard userId={userId} />} />
          <Route
            path='dashboard/mastertodolist'
            element={<MasterTodoList />}
            action={createAction}
          />
          <Route
            path='dashboard/account'
            element={<Account userId={userId} />}
          />
        </Route>

        {/* Define any other routes that do not share the RootLayout outside of this group */}
      </Routes>
    </SessionContext.Provider>
  );
}
export default Router;
