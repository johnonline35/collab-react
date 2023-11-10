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
import { storeRefreshToken } from "./utils/database";

function Router() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  async function supabaseCall() {
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
    supabaseCall();
  }, []);

  //   return (
  //     <SessionContext.Provider value={session}>
  //       <Routes>
  //         {/*Public Routes */}
  //         <Route path='/' element={<Login />} />
  //         <Route path='/privacy' element={<Privacy />} />
  //         <Route path='/termsofservice' element={<TermsOfService />} />

  //         {/*Private Routes */}
  //         <Route path='/collabs' element={<RootLayout />}>
  //           <Route
  //             path=':workspace_id'
  //             element={
  //               <PrivateRoute>
  //                 <CollabPageHome session={session} />
  //               </PrivateRoute>
  //             }
  //           >
  //             {/* Nested route for CollabPageNotes inside CollabPageHome */}
  //             <Route
  //               path=':collab_user_note_id'
  //               element={
  //                 <PrivateRoute>
  //                   <CollabPageNotes />
  //                 </PrivateRoute>
  //               }
  //             />
  //             <Route
  //               path='team'
  //               element={
  //                 <PrivateRoute>
  //                   <CollabPageTeam />
  //                 </PrivateRoute>
  //               }
  //             />
  //             <Route path='share' element={<CollabPageShowcase />} />
  //             <Route path='files' element={<CollabPageAllAttachments />} />
  //           </Route>
  //         </Route>

  //         <Route
  //           path='/dashboard'
  //           element={
  //             <PrivateRoute>
  //               <RootLayout />
  //             </PrivateRoute>
  //           }
  //         >
  //           <Route
  //             index
  //             element={
  //               <PrivateRoute>
  //                 <Dashboard />
  //               </PrivateRoute>
  //             }
  //           />
  //           <Route
  //             path='mastertodolist'
  //             element={<MasterTodoList />}
  //             action={createAction}
  //           />
  //           <Route
  //             path='account'
  //             element={
  //               <PrivateRoute>
  //                 <Account />
  //               </PrivateRoute>
  //             }
  //           />
  //         </Route>
  //       </Routes>
  //     </SessionContext.Provider>
  //   );
  // }

  // export default Router;
  return (
    <SessionContext.Provider value={session}>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/termsofservice' element={<TermsOfService />} />

        {/* RootLayout as the common layout component */}
        <Route element={<RootLayout />}>
          {/* Private routes that require authentication */}
          <Route element={<PrivateRoute />}>
            <Route path='collabs/:workspace_id' element={<CollabPageHome />}>
              <Route
                path=':collab_user_note_id'
                element={<CollabPageNotes />}
              />
              <Route path='team' element={<CollabPageTeam />} />
              <Route path='share' element={<CollabPageShowcase />} />
              <Route path='files' element={<CollabPageAllAttachments />} />
              {/* ... more nested routes if needed */}
            </Route>

            <Route path='dashboard' element={<Dashboard />}>
              <Route index element={<Dashboard />} />
              <Route path='mastertodolist' element={<MasterTodoList />} />
              <Route path='account' element={<Account />} />
              {/* ... more nested routes if needed */}
            </Route>
          </Route>
          {/* ... more routes that use RootLayout */}
        </Route>

        {/* ... other routes that don't use RootLayout */}
      </Routes>
    </SessionContext.Provider>
  );
}
export default Router;
