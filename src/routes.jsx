import React from "react";
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

function getCookie(c_name) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + "=");
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1;
      let c_end = document.cookie.indexOf(";", c_start);
      if (c_end === -1) {
        c_end = document.cookie.length;
      }
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}

// TODO: check on Supabase on how to get a token

function Router() {
  const isAuthenticated = getCookie("token");
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route
        path='/privacy'
        element={isAuthenticated ? <Privacy /> : <Navigate to='/' replace />}
      />

      <Route path='/termsofservice' element={<TermsOfService />} />
      <Route path='/collabs/:customer_id' element={<CollabPageLayout />}>
        <Route path='/collabs/:customer_id' element={<CollabPageHome />} />
        <Route path='/collabs/:customer_id/team' element={<CollabPageTeam />} />
        <Route path='/collabs/:customer_id/notes' element={<CollabPage />} />
        <Route
          path='/collabs/:customer_id/nextsteps'
          element={<CollabPageNextSteps />}
        />
        <Route
          path='/collabs/:customer_id/challenges'
          element={<CollabPageChallenges />}
        />
        <Route
          path='/collabs/:customer_id/proposals'
          element={<CollabPageProposals />}
        />
        <Route
          path='/collabs/:customer_id/currentstate'
          element={<CollabPageCurrentState />}
        />
        <Route
          path='/collabs/:customer_id/legaldocuments'
          element={<CollabPageLegalDocuments />}
        />
        <Route
          path='/collabs/:customer_id/pricing'
          element={<CollabPagePricing />}
        />
        <Route
          path='/collabs/:customer_id/timeline'
          element={<CollabPageTimeline />}
        />
        <Route
          path='/collabs/:customer_id/questions'
          element={<CollabPageQuestions />}
        />
        <Route
          path='/collabs/:customer_id/allattachments'
          element={<CollabPageAllAttachments />}
        />
      </Route>
      <Route path='/dashboard' element={<RootLayout />}>
        <Route index element={<Dashboard />} />
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
