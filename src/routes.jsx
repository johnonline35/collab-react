import React, { useEffect } from "react";
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
import CollabPage from "./pages/collabs/CollabPageNotes";
import CollabPageLayout from "./layouts/CollabPageLayout";
import CollabPageTeam from "./pages/collabs/CollabPageTeam";
import CollabPageHome from "./pages/collabs/CollabPageHome";
import CollabPageChallenges from "./pages/collabs/CollabPageChallenges";
import CollabPageNextSteps from "./pages/collabs/CollabPageNextSteps";
import CollabPageProposals from "./pages/collabs/CollabPageProposals";
import CollabPageCurrentState from "./pages/collabs/CollabPageCurrentState";
import CollabPageLegalDocuments from "./pages/collabs/CollabPageLegalDocuments";
import CollabPagePricing from "./pages/collabs/CollabPagePricing";
import CollabPageTimeline from "./pages/collabs/CollabPageTimeline";
import CollabPageQuestions from "./pages/collabs/CollabPageQuestions";
import CollabPageAllAttachments from "./pages/collabs/CollabPageAllAttachments";
import CollabPageShowcase from "./pages/collabs/CollabPageShowcase";
import { createCookie, PrivateRoute } from "./privateRoute";
import { supabase } from "./supabase/clientapp";

function Router() {
  async function supabaseCall() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      createCookie("token", session.access_token, session.expires_in);
    }
  }

  useEffect(() => {
    supabaseCall();
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route
        path='/privacy'
        element={
          <PrivateRoute>
            <Privacy />
          </PrivateRoute>
        }
      />
      {/* <Route exact path='/privacy' element={<PrivateRoute />}>
        <Route path='' element={<Privacy />} />
      </Route> */}
      <Route path='/termsofservice' element={<TermsOfService />} />
      <Route
        path='/collabs/:attendee_company_id'
        element={<CollabPageLayout />}
      >
        <Route
          path='/collabs/:attendee_company_id'
          element={
            <PrivateRoute>
              <CollabPageHome />
            </PrivateRoute>
          }
        />
        <Route
          path='/collabs/:attendee_company_id/team'
          element={
            <PrivateRoute>
              <CollabPageTeam />
            </PrivateRoute>
          }
        />
        <Route
          path='/collabs/:attendee_company_id/showcase'
          element={<CollabPageShowcase />}
        />
        <Route
          path='/collabs/:attendee_company_id/notes'
          element={<CollabPage />}
        />
        <Route
          path='/collabs/:attendee_company_id/nextsteps'
          element={<CollabPageNextSteps />}
        />
        <Route
          path='/collabs/:attendee_company_id/challenges'
          element={<CollabPageChallenges />}
        />
        <Route
          path='/collabs/:attendee_company_id/proposals'
          element={<CollabPageProposals />}
        />
        <Route
          path='/collabs/:attendee_company_id/currentstate'
          element={<CollabPageCurrentState />}
        />
        <Route
          path='/collabs/:attendee_company_id/legaldocuments'
          element={<CollabPageLegalDocuments />}
        />
        <Route
          path='/collabs/:attendee_company_id/pricing'
          element={<CollabPagePricing />}
        />
        <Route
          path='/collabs/:attendee_company_id/timeline'
          element={<CollabPageTimeline />}
        />
        <Route
          path='/collabs/:attendee_company_id/questions'
          element={<CollabPageQuestions />}
        />
        <Route
          path='/collabs/:attendee_company_id/allattachments'
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
        <Route path='/dashboard/account' element={<Account />} />
      </Route>
    </Routes>
  );
}

export default Router;
