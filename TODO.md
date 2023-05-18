## To-Do List:

1. Finish the attendees backend calls in both the team list and dashboard components.

   - Implement set workspace lead functionality.
   - Implement delete functionality.
   - Prevent the page from re-rendering upon updates.

2. Set up all the api's needed to fetch data for the dashboard:

   - Follow these steps for calendar api:

     - Fetch next 2-months + last 60 months of meetings.
     - Store in supabase.
     - Use today and then increment forward by day until 8 meetings have been reached
     - Display no more than 8 of them
     - Then use those 8 meetings to query the last 60 months of meetings by url
     - Then store each url as a seperate workspace, and list the attendees of the workspace using email as the key
     - Then query the below apis to enrich each profile:

   - Attendee avatars: https://www.avatarapi.com/
   - Company logo's headers, socials, url: https://brandfetch.com/
   - Company funding, LinkedIn, employee headcounts: https://rapidapi.com/williambarberjr/api/linkedin-company-data

3. Update the CSS for the notepad so that it auto creates new pages breaks + infinite scroll.

4. Use Aria to create calendar picker:

   - https://react-spectrum.adobe.com/react-aria/useDateRangePicker.html

5. Build gmail integration for headers. HOLD: Oauth scope is too hard, leave this for now.

6. For Alerts from Chanchal:

   - how about this: For alerts on companies have an end point lets say /alert/company/<companyid> so you generate alert for a company and its collabs job to distribute alert to specific personnel related to the company. would involve alert_source table which will have company id and markup for alert. Background process will take the alert and insert to another table called alert_users which will contain alert_id collab_user_id published_date and acknowledged_date and possibly next_step also. till acknowledged_date field is not filled or 7 days since published date we will show alert to user

   Supabase is a powerful tool and it can help you manage your database and user authentication. However, as of my last knowledge update in September 2021, Supabase doesn't offer native functionality for external API calls and real-time processing.

PROCESS FOR CREATING MESSAGE QUEUES

Here is a general approach you could consider, combining Supabase with a serverless compute service like AWS Lambda, or a similar service:

1. **Fetch Data from Google Calendar API**: You can make API calls to Google Calendar when a user logs in. This can be done in the client-side JavaScript, or on a server using Node.js for example.

2. **Store Data in Supabase**: Once you've retrieved the data, you can insert it into your Supabase table.

3. **Trigger a Serverless Function**: After inserting data into your table, you can use Supabase's real-time subscriptions to listen for changes in your database. When a new row is added, you can trigger a serverless function (like AWS Lambda or similar services) to enrich the data.

4. **Enrich Data with Paid Data API**: Your serverless function will make a call to your paid data API, using the email address from the new row as an input. The function will then retrieve the name and avatar data.

5. **Store Enriched Data in Supabase**: After enriching the data, the serverless function will insert the additional data into a different table in your Supabase database.

6. **Return Data to Client**: Finally, once the enriched data is stored, you can return this data to the user in your application. You might do this by listening for changes in your enriched data table, or simply by re-querying the table after a certain time interval.

This process does involve a combination of tools, but it should be fairly efficient and scalable. Using a serverless function for the data enrichment means you can handle many concurrent requests without worrying about server capacity.

Remember to handle possible errors and edge cases, such as failed API calls or empty responses. The specific way to handle these will depend on the behavior of your paid data API and the needs of your application.

However, it's important to note that the specifics of this process might change if Supabase introduces new features or capabilities. Always check their official documentation for the most up-to-date information.
