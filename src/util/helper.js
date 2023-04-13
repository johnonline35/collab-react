export function FetchWrapper(promise1, promise2, promise3) {
  return Promise.all([promise1, promise2, promise3]).then((values) => {
    return values;
  });
}

// FetchWrapper(
//   supabase.from("collab_users").select(`collab_user_name`),
//   supabase
//     .from("workspaces")
//     .select(`workspace_id, workspace_name, workspace_avatar`),
//   supabase.from("attendees").select()
// ).then((results) => {
//   // console.log("Check this one:", results);
//   const [value1, value2] = results;
//   const collabUser = value1.data;
//   const workspace = value2.data;
//   // const attendee = value3.data;

//   // attach a collab user to the company object
//   for (let i = 0; i < workspace.length; i++) {
//     workspace[i].collabUser = collabUser[0];
//   }
//   //

//   setCompanyInfo(workspace);
//   setLoadingCards(false);
// });
