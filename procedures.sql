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

-- Run script on existing data:
UPDATE attendees
SET attendee_name = COALESCE(NULLIF(TRIM(attendee_name), ''), pdl_api_users.full_name),
    attendee_job_title = COALESCE(NULLIF(TRIM(attendee_job_title), ''), pdl_api_users.job_title)
FROM pdl_api_users
WHERE attendees.attendee_email = pdl_api_users.email_address_collab_key;

