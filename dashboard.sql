CREATE OR REPLACE FUNCTION 0001test_dashboard(_userid UUID)
RETURNS TABLE (
    collab_user_name VARCHAR (this column comes from the collab_users table and collab_user.id is equal to _userid)
    workspace_name VARCHAR (this column comes from the workspaces table and workspaces.collab_user_id is equal to _userid)
    workspace_id UUID (this column comes from the workspaces table and workspaces.workspace_id)
    domain VARCHAR (this column comes from the workspaces table and workspaces.domain)
    job_company_size VARCHAR (this column comes from the pdl_api_users table and column pdl_api_users.job_company_size and the key is that the pdl_api_users.email_address_collab_key is equal to attendee.attendee_email which has in that same table a column called attendee.workspace_id which is equal to the table and column workspace.id)
    description VARCHAR (this column comes from the brandfetch_data table and brandfetch_data.description and the key is that the brandfetch_data.domain is equal to the workspaces.domain)
    image VARCHAR (this column comes from the avatar_api table and avatar_api.image and the key is that avatar_api.email is equal to attendees.attendee_email)
    attendee_email (this column comes from the attendees table and attendees.attendee_email and the key is that attendees.workspaces_id is equal to workspaces.workspace_id)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
      
    FROM
        
    INNER JOIN 
END; $$
LANGUAGE plpgsql;