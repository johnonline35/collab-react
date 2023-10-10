import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/LazyLoadDashboard";

// layouts and pages
import RootLayout from "./layouts/RootLayout";

// import { tasksLoader } from "./pages/Dashboard";
import MasterTodoList, { createAction } from "./pages/MasterTodoList";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Privacy from "./pages/compliance/Privacy";
import TermsOfService from "./pages/compliance/TermsOfService";
import CollabPageLayout from "./layouts/CollabPageLayout";
import CollabPageTeam from "./pages/collabs/CollabPageTeam";
import CollabPageHome from "./pages/collabs/CollabPageHome";
import CollabPageJourney from "./pages/collabs/CollabPageJourney";
import CollabPageAllAttachments from "./pages/collabs/CollabPageAllAttachments";
import CollabPageShowcase from "./pages/collabs/CollabPageShowcase";
import CollabPageNotes from "./pages/collabs/CollabPageNotes";

// import { supabase } from "./supabase/clientapp";
import { createCookie, PrivateRoute, SessionContext } from "./privateRoute";
import { supabase } from "./supabase/clientapp";
import { storeRefreshToken } from "./util/database";

function Router() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  async function supabaseCall() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      console.log("SESSION", session);
      createCookie("token", session.access_token, session.expires_in);
      setSession(session);
      const userId = session?.user.id;
      // console.log("ROUTE userId", userId);
      setUserId(userId);
      const refreshToken = session?.provider_refresh_token;

      await storeRefreshToken(userId, refreshToken);
    }
    setLoading(false);
  }

  useEffect(() => {
    supabaseCall();
  }, []);

  return (
    <SessionContext.Provider value={session}>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/privacy' element=<Privacy /> />
        {/* <Route exact path='/privacy' element={<PrivateRoute />}>
        <Route path='' element={<Privacy />} />
      </Route> */}
        <Route path='/termsofservice' element={<TermsOfService />} />
        <Route
          path='/collabs/:workspace_id'
          element={<CollabPageLayout userId={userId} />}
        >
          <Route
            path='/collabs/:workspace_id'
            element={
              <PrivateRoute>
                <CollabPageHome />
              </PrivateRoute>
            }
          />
          <Route
            path='/collabs/:workspace_id/team'
            element={
              <PrivateRoute>
                <CollabPageTeam />
              </PrivateRoute>
            }
          />
          <Route
            path='/collabs/:workspace_id/share'
            element={<CollabPageShowcase />}
          />
          <Route
            path='/collabs/:workspace_id/notes'
            element={<CollabPageNotes />}
          />
          <Route
            path='/collabs/:workspace_id/journey'
            element={<CollabPageJourney />}
          />

          {/* <Route
          path='/collabs/:workspace_id/challenges'
          element={<CollabPageChallenges />}
        />
        <Route
          path='/collabs/:workspace_id/proposals'
          element={<CollabPageProposals />}
        />
        <Route
          path='/collabs/:workspace_id/currentstate'
          element={<CollabPageCurrentState />}
        />
        <Route
          path='/collabs/:workspace_id/legaldocuments'
          element={<CollabPageLegalDocuments />}
        />
        <Route
          path='/collabs/:workspace_id/pricing'
          element={<CollabPagePricing />}
        />
        <Route
          path='/collabs/:workspace_id/timeline'
          element={<CollabPageTimeline />}
        />
        <Route
          path='/collabs/:workspace_id/questions'
          element={<CollabPageQuestions />}
        /> */}
          <Route
            path='/collabs/:workspace_id/files'
            element={<CollabPageAllAttachments />}
          />
        </Route>

        {/* <Route index element={<Dashboard />} /> */}
        <Route path='/newapp' element={<RootLayout />}>
          <Route
            index
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          {/* <Route
          path='/dashboard/mastertodolist'
          element={<MasterTodoList />}
          action={createAction}
        />
        <Route path='/dashboard/account' element={<Account />} /> */}
        </Route>

        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <RootLayout />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path='/dashboard/mastertodolist'
            element={<MasterTodoList />}
            action={createAction}
          />
          <Route
            path='/dashboard/account'
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </SessionContext.Provider>
  );
}

export default Router;
