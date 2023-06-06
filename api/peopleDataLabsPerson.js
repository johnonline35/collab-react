// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDLJS = require("peopledatalabs");
const peopledatalabs_api_key = process.env.REACT_APP_PEOPLEDATALABS;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "your-supabase-url"; // replace with your Supabase URL
const supabaseKey = "your-supabase-key"; // replace with your Supabase service key

// Create a client, specifying your API key
const PDLClient = new PDLJS({ apiKey: peopledatalabs_api_key });
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  const params = {
    email: "viviana@felicis.com",
    min_likelihood: 4,
  };

  try {
    const data = await PDLClient.person.enrichment(params);
    const record = data.data;

    console.log(record);

    console.log("successfully enriched profile with pdl data");

    // Upsert data into Supabase
    await supabase.from("pdl_api_users").upsert(
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
          job_company_location_continent: record.job_company_location_continent,
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
        },
      ],
      { onConflict: "id" }
    );

    res.json(record);
  } catch (error) {
    console.error("Enrichment unsuccessful. See error and try again.");
    console.error(error);

    res
      .status(500)
      .send("Enrichment unsuccessful. See server logs for more details.");
  }
};
