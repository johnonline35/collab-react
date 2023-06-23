CREATE OR REPLACE FUNCTION test_dashboard(_userid UUID)
RETURNS TABLE (
    collab_user_name TEXT,
    workspace_name TEXT,
    workspace_id UUID,
    domain TEXT,
    job_company_size TEXT,
    description TEXT,
    image TEXT,
    attendee_email TEXT,
    attendee_name TEXT, 
    attendee_job_title TEXT, 
    banner_src TEXT,
    icon_src TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    crunchbase_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cu.collab_user_name AS collab_user_name,
        w.workspace_name AS workspace_name,
        w.workspace_id AS workspace_id,
        w.domain AS domain,
        pau.job_company_size AS job_company_size,
        bd.description AS description,
        aa.image AS image,
        a.attendee_email AS attendee_email,
        a.attendee_name AS attendee_name, 
        a.attendee_job_title AS attendee_job_title, 
        bd.images #>> '{0,formats,0,src}' AS banner_src,
        (
            SELECT jsonb_array_element #>> '{formats,0,src}'
            FROM jsonb_array_elements(bd.logos) AS dt(jsonb_array_element)
            WHERE dt.jsonb_array_element ->> 'type' = 'icon'
            AND dt.jsonb_array_element ->> 'theme' = 'dark'
            LIMIT 1
        ) AS icon_src,
        (
            SELECT jsonb_element ->> 'url'
            FROM jsonb_array_elements(bd.links) AS dt(jsonb_element)
            WHERE dt.jsonb_element ->> 'name' = 'linkedin'
            LIMIT 1
        ) AS linkedin_url,
        (
            SELECT jsonb_element ->> 'url'
            FROM jsonb_array_elements(bd.links) AS dt(jsonb_element)
            WHERE dt.jsonb_element ->> 'name' = 'twitter'
            LIMIT 1
        ) AS twitter_url,
        (
            SELECT jsonb_element ->> 'url'
            FROM jsonb_array_elements(bd.links) AS dt(jsonb_element)
            WHERE dt.jsonb_element ->> 'name' = 'instagram'
            LIMIT 1
        ) AS instagram_url,
        (
            SELECT jsonb_element ->> 'url'
            FROM jsonb_array_elements(bd.links) AS dt(jsonb_element)
            WHERE dt.jsonb_element ->> 'name' = 'facebook'
            LIMIT 1
        ) AS facebook_url,
        (
            SELECT jsonb_element ->> 'url'
            FROM jsonb_array_elements(bd.links) AS dt(jsonb_element)
            WHERE dt.jsonb_element ->> 'name' = 'crunchbase'
            LIMIT 1
        ) AS crunchbase_url
    FROM
        collab_users AS cu
    INNER JOIN workspaces AS w ON cu.id = w.collab_user_id AND cu.id = _userid
    LEFT JOIN attendees AS a ON w.workspace_id = a.workspace_id AND a.attendee_is_workspace_lead = TRUE
    LEFT JOIN pdl_api_users AS pau ON a.attendee_email = pau.email_address_collab_key
    LEFT JOIN brandfetch_data AS bd ON w.domain = bd.domain
    LEFT JOIN avatarapi_data AS aa ON a.attendee_email = aa.email
    WHERE
        cu.id = _userid;
END;
$$ LANGUAGE plpgsql;








-- CREATE OR REPLACE FUNCTION test_dashboard(_userid UUID)
-- RETURNS TABLE (
--     collab_user_name VARCHAR,
--     workspace_name VARCHAR,
--     workspace_id UUID,
--     domain VARCHAR,
--     job_company_size VARCHAR,
--     description VARCHAR,
--     image VARCHAR,
--     attendee_email VARCHAR
-- ) AS $$
-- BEGIN
--     RETURN QUERY
--     SELECT
--         cu.collab_user_name::VARCHAR AS collab_user_name, -- Casting to VARCHAR
--         w.workspace_name::VARCHAR AS workspace_name,
--         w.workspace_id AS workspace_id,
--         w.domain::VARCHAR AS domain,
--         pau.job_company_size::VARCHAR AS job_company_size,
--         bd.description::VARCHAR AS description,
--         aa.image::VARCHAR AS image,
--         a.attendee_email::VARCHAR AS attendee_email
--     FROM
--         collab_users AS cu
--     INNER JOIN workspaces AS w ON cu.id = w.collab_user_id AND cu.id = _userid
--     INNER JOIN attendees AS a ON w.workspace_id = a.workspace_id AND a.attendee_is_workspace_lead = TRUE
--     INNER JOIN pdl_api_users AS pau ON a.attendee_email = pau.email_address_collab_key
--     INNER JOIN brandfetch_data AS bd ON w.domain = bd.domain
--     INNER JOIN avatarapi_data AS aa ON a.attendee_email = aa.email
--     WHERE
--         cu.id = _userid;
-- END; $$
-- LANGUAGE plpgsql;
