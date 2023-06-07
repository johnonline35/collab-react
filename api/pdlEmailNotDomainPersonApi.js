// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDLJS = require("peopledatalabs");
const peopledatalabs_api_key = process.env.REACT_APP_PEOPLEDATALABS;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create clients
const PDLClient = new PDLJS({ apiKey: peopledatalabs_api_key });
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Utility function to check and correct the date format
function correctDateFormat(dateStr) {
  // Return a default value if dateStr is null
  if (dateStr === null) {
    return null;
  }
  var dateParts = dateStr.split("-");
  // If the date string has one part, it's a year. Append "-01-01".
  if (dateParts.length === 1) {
    return dateStr + "-01-01";
  }
  // If the date string has two parts, it's a year and month. Append "-01".
  if (dateParts.length === 2) {
    return dateStr + "-01";
  }
  // If the date string has three parts, it's already in the correct format.
  return dateStr;
}

module.exports = async (req, res) => {
  // Extract newRow from the parsed body
  const newRow = req.body;

  // Extract email from newRow
  const email = newRow?.record?.meeting_attendee_email;

  if (!email) {
    console.log("Missing email in request body");
    res.status(400).json({ error: "Missing email in request body" });
    return;
  }

  // Check if email exists in the pdl_api_users table
  const { data: existingData, error: fetchError } = await supabase
    .from("pdl_api_users")
    .select("email_address_collab_key")
    .eq("email_address_collab_key", email);

  if (fetchError) {
    console.error("Error fetching data from Supabase:", fetchError);
    res.status(500).json({ error: fetchError.message });
    return;
  }

  // If the email already exists, exit the function
  if (existingData.length > 0) {
    console.log("Email already exists, exiting function.");
    res.status(200).json({ message: "Email already exists." });
    return;
  }

  const params = {
    email: email,
    min_likelihood: 4,
  };

  try {
    const data = await PDLClient.person.enrichment(params);
    const record = data.data;

    console.log(record.full_name);

    // Upsert data into Supabase
    const { error: upsertUserError } = await supabase
      .from("pdl_api_users")
      .upsert(
        [
          {
            id: record.id,
            full_name: record.full_name,
            first_name: record.first_name,
            middle_initial: record.middle_initial,
            middle_name: record.middle_name,
            last_initial: record.last_initial,
            last_name: record.last_name,
            gender: record.gender,
            birth_year: record.birth_year,
            birth_date: record.birth_date,
            linkedin_url: record.linkedin_url,
            linkedin_username: record.linkedin_username,
            linkedin_id: record.linkedin_id,
            facebook_url: record.facebook_url,
            facebook_username: record.facebook_username,
            facebook_id: record.facebook_id,
            twitter_url: record.twitter_url,
            twitter_username: record.twitter_username,
            github_url: record.github_url,
            github_username: record.github_username,
            work_email: record.work_email,
            recommended_personal_email: record.recommended_personal_email,
            mobile_phone: record.mobile_phone,
            industry: record.industry,
            job_title: record.job_title,
            job_title_role: record.job_title_role,
            job_title_sub_role: record.job_title_sub_role,
            job_title_levels: record.job_title_levels,
            job_company_id: record.job_company_id,
            job_company_name: record.job_company_name,
            job_company_website: record.job_company_website,
            job_company_size: record.job_company_size,
            job_company_founded: record.job_company_founded,
            job_company_industry: record.job_company_industry,
            job_company_linkedin_url: record.job_company_linkedin_url,
            job_company_linkedin_id: record.job_company_linkedin_id,
            job_company_facebook_url: record.job_company_facebook_url,
            job_company_twitter_url: record.job_company_twitter_url,
            job_company_location_name: record.job_company_location_name,
            job_company_location_locality: record.job_company_location_locality,
            job_company_location_metro: record.job_company_location_metro,
            job_company_location_region: record.job_company_location_region,
            job_company_location_geo: record.job_company_location_geo,
            job_company_location_street_address:
              record.job_company_location_street_address,
            job_company_location_address_line_2:
              record.job_company_location_address_line_2,
            job_company_location_postal_code:
              record.job_company_location_postal_code,
            job_company_location_country: record.job_company_location_country,
            job_company_location_continent:
              record.job_company_location_continent,
            job_last_updated: record.job_last_updated,
            job_start_date: record.job_start_date,
            location_name: record.location_name,
            location_locality: record.location_locality,
            location_metro: record.location_metro,
            location_region: record.location_region,
            location_country: record.location_country,
            location_continent: record.location_continent,
            location_street_address: record.location_street_address,
            location_address_line_2: record.location_address_line_2,
            location_postal_code: record.location_postal_code,
            location_geo: record.location_geo,
            location_last_updated: record.location_last_updated,
            email_address_collab_key: email,
          },
        ],
        { onConflict: "id" }
      );

    if (upsertUserError) {
      console.error("Upserting user data failed: ", upsertUserError);
    } else {
      console.log("Successfully upserted user data");
    }

    console.log("Upserting data into pdl_api_experience...");

    for (let experience of record.experience) {
      const experienceData = {
        user_id: record.id,
        company_name: experience.company.name,
        company_size: experience.company.size,
        company_id: experience.company.id,
        company_founded: experience.company.founded,
        company_industry: experience.company.industry,
        company_location_name: experience.company.location
          ? experience.company.location.name
          : null,
        company_linkedin_url: experience.company.linkedin_url,
        company_linkedin_id: experience.company.linkedin_id,
        company_facebook_url: experience.company.facebook_url,
        company_twitter_url: experience.company.twitter_url,
        company_website: experience.company.website,
        start_date: correctDateFormat(experience.start_date),
        end_date: correctDateFormat(experience.end_date),
        title_name: experience.title.name,
        title_role: experience.title.role,
        title_sub_role: experience.title.sub_role,
        is_primary: experience.is_primary,
      };

      try {
        const { error: upsertExperienceError } = await supabase
          .from("pdl_api_experience")
          .upsert([experienceData], {
            onConflict: ["user_id", "company_id", "start_date", "title_name"],
          });

        if (upsertExperienceError) {
          console.error(
            "Upserting experience data failed: ",
            upsertExperienceError
          );
        } else {
          console.log(
            `Successfully upserted experience for ${experienceData.company_name}`
          );
        }
      } catch (error) {
        console.error(
          "Error occurred during upserting user data: ",
          error.message
        );
        if (error.details) {
          console.error("Error details: ", error.details);
        }
      }
    }

    console.log("Upserted data into pdl_api_experience");

    // Upsert data into Supabase pdl_api_education table
    for (let education of record.education) {
      const educationData = {
        user_id: record.id,
        school_name: education.school.name,
        school_type: education.school.type,
        school_id: education.school.id,
        school_location_name: education.school.location.name,
        school_linkedin_url: education.school.linkedin_url,
        school_facebook_url: education.school.facebook_url,
        school_twitter_url: education.school.twitter_url,
        school_linkedin_id: education.school.linkedin_id,
        school_website: education.school.website,
        school_domain: education.school.domain,
        degree: education.degrees,
        start_date: correctDateFormat(education.start_date),
        end_date: correctDateFormat(education.end_date),
        major: education.majors,
        minor: education.minors,
        gpa: education.gpa,
      };

      try {
        const { error: upsertEducationError } = await supabase
          .from("pdl_api_education")
          .upsert([educationData], {
            onConflict: ["user_id", "school_id"],
          });

        if (upsertEducationError) {
          console.error(
            "Upserting education data failed: ",
            upsertEducationError
          );
        } else {
          console.log(
            `Successfully upserted education for ${educationData.school_name}`
          );
        }
      } catch (error) {
        console.error(
          "Error occurred during upserting education data: ",
          error.message
        );
        if (error.details) {
          console.error("Error details: ", error.details);
        }
      }
    }
    console.log("Upserted data into pdl_api_education");
    res.json(record);
  } catch (error) {
    console.error("Enrichment unsuccessful. See error and try again.");
    console.error(error);

    res
      .status(500)
      .send("Enrichment unsuccessful. See server logs for more details.");
  }
};
