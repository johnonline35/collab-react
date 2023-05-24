// Import necessary dependencies
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require("jsonwebtoken");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require("@supabase/supabase-js");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { google } = require("googleapis");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Bottleneck = require("bottleneck");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const jwtSecret = process.env.SUPABASE_JWT_SECRET;
const token = process.env.REFRESH_TOKEN;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize rate limiter
const limiter = new Bottleneck({
  minTime: 100, // Adjust this value based on your rate limits
});

// Initialize Google auth client
const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  "localhost:3000" // change this to your redirect url
);

// Function to load Google client
const loadClient = () => {
  oauth2Client.setCredentials({ refresh_token: token });
  return google.calendar({ version: "v3", auth: oauth2Client });
};

module.exports = async (req, res) => {
  try {
    // Extract and verify the JWT from the authorization header
    const authHeader = req.headers["authorization"];
    const authToken = authHeader && authHeader.split(" ")[1];

    if (!authToken) {
      return res.status(401).json({ message: "Unauthorized" }); // Unauthorized
    }

    jwt.verify(authToken, jwtSecret, async (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" }); // Forbidden
      }

      const { data, error } = await supabase.auth.api.getUser(authToken);
      if (error) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Load Google client
      const calendar = loadClient();

      // Use the calendar to get meetings
      const meetings = await getGoogleCal(calendar);

      // Respond with the meetings
      res.status(200).json({ meetings });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function getGoogleCal() {
  const calendar = loadClient();

  const now = new Date();
  const sixtyMonthsAgo = new Date(now.getTime());
  sixtyMonthsAgo.setMonth(now.getMonth() - 1);
  const timeMin = sixtyMonthsAgo.toISOString();

  const twoMonthsFromNow = new Date(now.getTime());
  twoMonthsFromNow.setMonth(now.getMonth() + 2);
  const timeMax = twoMonthsFromNow.toISOString();

  let allEvents = [];
  let nextPageToken = undefined;

  try {
    do {
      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: timeMin,
        timeMax: timeMax,
        singleEvents: true,
        orderBy: "startTime",
        pageToken: nextPageToken,
      });

      allEvents = allEvents.concat(response.data.items);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    const meetings = allEvents.filter(
      (event) =>
        event.attendees &&
        event.attendees.length > 1 &&
        event.attendees.length < 11
    );

    // Insert data into the database for each meeting
    const upsertPromises = meetings.map(async (meeting) => {
      const attendees = meeting.attendees.filter(
        (attendee) => attendee.email !== "johnchildseddy@gmail.com"
      );

      const meetingData = {
        id: meeting.id,
        summary: meeting.summary,
        creator_email: meeting.creator.email,
        organizer_email: meeting.organizer.email,
        start_dateTime: meeting.start.dateTime,
        end_dateTime: meeting.end.dateTime,
      };

      try {
        console.log("Upserting meeting data:", meetingData);
        // Wait for the meeting upsert to complete before upserting attendees
        const { data: upsertMeetingData, error: upsertMeetingError } =
          await limiter.schedule(() =>
            supabase
              .from("meetings")
              .upsert([meetingData], { returning: "minimal" })
          );

        if (upsertMeetingError) {
          console.error("Upsert Meeting Error:", upsertMeetingError);
          return;
        }

        console.log("Upsert Meeting Data:", upsertMeetingData);

        // Now that the meeting has been upserted, upsert attendees
        await Promise.all(
          attendees.map(async (attendee) => {
            const { data: upsertAttendeeData, error: upsertAttendeeError } =
              await limiter.schedule(() =>
                supabase.from("meeting_attendees").upsert(
                  [
                    {
                      meeting_id: meeting.id,
                      email: attendee.email,
                      organizer: attendee.organizer || false,
                      response_status: attendee.responseStatus,
                    },
                  ],
                  { returning: "minimal" }
                )
              );

            if (upsertAttendeeError) {
              console.error("Upsert Attendee Error:", upsertAttendeeError);
            } else {
              console.log("Upsert Attendee Data:", upsertAttendeeData);
            }
          })
        );
      } catch (error) {
        console.error("Upsert process error:", error);
      }
    });

    await Promise.all(upsertPromises);

    // Log filtered meetings
    // console.log(JSON.stringify(meetings, null, 2));

    return meetings;
  } catch (error) {
    console.error("The API returned an error:", error);
    return [];
  }
}
