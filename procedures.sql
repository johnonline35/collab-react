-- Duplicate data from pdl_api_users into attendees
CREATE OR REPLACE FUNCTION duplicate_data() RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM attendees
        WHERE attendees.attendee_email = NEW.email_address_collab_key
        AND attendees.attendee_name = NEW.full_name
        AND attendees.attendee_job_title = NEW.job_title
    ) THEN
        INSERT INTO attendees (attendee_name, attendee_job_title, attendee_email)
        VALUES (NEW.full_name, NEW.job_title, NEW.email_address_collab_key);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Duplicate data from pdl_api_users into attendees
CREATE TRIGGER trigger_duplicate_data
AFTER INSERT OR UPDATE ON pdl_api_users
FOR EACH ROW EXECUTE PROCEDURE duplicate_data();

-- Run script on existing data:
INSERT INTO attendees (attendee_name, attendee_job_title, attendee_email)
SELECT full_name, job_title, email_address_collab_key
FROM pdl_api_users
WHERE NOT EXISTS (
    SELECT 1
    FROM attendees
    WHERE attendees.attendee_email = pdl_api_users.email_address_collab_key
    AND attendees.attendee_name = pdl_api_users.full_name
    AND attendees.attendee_job_title = pdl_api_users.job_title
);

