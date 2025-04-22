/*
  # Add team column to advisors table

  1. Changes
    - Add `team` column to `advisors` table if it doesn't exist
    - Column type is JSONB to store team member data
    - Default value is NULL to allow advisors without teams

  2. Safety
    - Uses IF NOT EXISTS to prevent errors if column already exists
    - No data loss as we're only adding a column
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'advisors' 
    AND column_name = 'team'
  ) THEN 
    ALTER TABLE advisors ADD COLUMN team jsonb;
  END IF;
END $$;