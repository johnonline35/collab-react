-- Duplicate data from pdl_api_users into attendees
CREATE OR REPLACE FUNCTION duplicate_data() RETURNS TRIGGER AS $$
BEGIN
    UPDATE attendees
    SET attendee_name = COALESCE(NULLIF(TRIM(attendee_name), ''), NEW.full_name),
        attendee_job_title = COALESCE(NULLIF(TRIM(attendee_job_title), ''), NEW.job_title)
    WHERE attendees.attendee_email = NEW.email_address_collab_key;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Duplicate data from pdl_api_users into attendees
CREATE TRIGGER trigger_duplicate_data
AFTER INSERT OR UPDATE ON pdl_api_users
FOR EACH ROW EXECUTE PROCEDURE duplicate_data();

-- Run script on existing data for name and email:
UPDATE attendees
SET attendee_name = COALESCE(NULLIF(TRIM(attendee_name), ''), pdl_api_users.full_name),
    attendee_job_title = COALESCE(NULLIF(TRIM(attendee_job_title), ''), pdl_api_users.job_title)
FROM pdl_api_users
WHERE attendees.attendee_email = pdl_api_users.email_address_collab_key;

-- Duplicate avatar data from avatarapi_data into attendees
CREATE OR REPLACE FUNCTION duplicate_avatar() RETURNS TRIGGER AS $$
BEGIN
    UPDATE attendees
    SET attendee_avatar = COALESCE(avatarapi_data.image, attendee_avatar)
    FROM avatarapi_data
    WHERE attendees.attendee_email = NEW.email
      AND attendees.attendee_avatar IS NULL;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute the duplicate_avatar function
CREATE TRIGGER trigger_duplicate_avatar
AFTER INSERT OR UPDATE ON avatarapi_data
FOR EACH ROW EXECUTE PROCEDURE duplicate_avatar();


-- Run script on existing data for Avatar
UPDATE attendees
SET attendee_avatar = COALESCE(avatarapi_data.image, attendee_avatar)
FROM avatarapi_data
WHERE attendees.attendee_email = avatarapi_data.email
  AND attendees.attendee_avatar IS NULL;

  -- Insert Default values if everything is still null:

CREATE OR REPLACE FUNCTION insert_default_values() RETURNS TRIGGER AS $$
BEGIN
    UPDATE attendees
    SET attendee_name = COALESCE(attendee_name, (SELECT name FROM defaults LIMIT 1)),
        attendee_job_title = COALESCE(attendee_job_title, (SELECT job_title FROM defaults LIMIT 1))
    WHERE attendee_name IS NULL OR attendee_job_title IS NULL;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Trigger for it:
CREATE TRIGGER trigger_insert_default_values
AFTER INSERT OR UPDATE ON attendees
FOR EACH ROW EXECUTE PROCEDURE insert_default_values();



