import React, { useEffect, useState } from "react";
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

function Router() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getSessionCreateCookieStoreToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      createCookie("token", session.access_token, session.expires_in);
      setSession(session);
      const userId = session?.user.id;

      const refreshToken = session?.provider_refresh_token;

      await storeRefreshToken(userId, refreshToken);
    }
    setLoading(false);
  }

  useEffect(() => {
    getSessionCreateCookieStoreToken();
  }, []);

  return (
    <SessionContext.Provider value={session}>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/termsofservice' element={<TermsOfService />} />

        {/* Wrap PrivateRoute and RootLayout around the child routes */}
        <Route
          element={
            <PrivateRoute>
              <RootLayout />
            </PrivateRoute>
          }
        >
          {/* Child routes for /collabs */}
          <Route path='collabs/:workspace_id' element={<CollabPageHome />}>
            <Route path=':collab_user_note_id' element={<CollabPageNotes />} />
            <Route path='team' element={<CollabPageTeam />} />
            <Route path='share' element={<CollabPageShowcase />} />
            <Route path='files' element={<CollabPageAllAttachments />} />
          </Route>

          {/* Child routes for /dashboard */}
          <Route path='dashboard' element={<Dashboard />} />
          <Route
            path='dashboard/mastertodolist'
            element={<MasterTodoList />}
            action={createAction}
          />
          <Route path='dashboard/account' element={<Account />} />
        </Route>

        {/* Define any other routes that do not share the RootLayout outside of this group */}
      </Routes>
    </SessionContext.Provider>
  );
}
export default Router;
