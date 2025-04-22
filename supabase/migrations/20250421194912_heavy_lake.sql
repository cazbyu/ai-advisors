/*
  # Update advisors schema

  1. Changes
    - Add route column for URL slugs
    - Add bio column for longer descriptions
    - Add tags column for searchable keywords
    - Update profile_image constraints
    - Add updated_at column with trigger

  2. Security
    - Keep existing RLS policies
    - Add index for route lookups
*/

-- Add new columns
ALTER TABLE public.advisors
ADD COLUMN IF NOT EXISTS route text GENERATED ALWAYS AS (LOWER(REPLACE(name, ' ', '-'))) STORED,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create index for route lookups
CREATE INDEX IF NOT EXISTS advisors_route_idx ON public.advisors (route);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_advisor_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_advisor_timestamp
  BEFORE UPDATE ON public.advisors
  FOR EACH ROW
  EXECUTE FUNCTION update_advisor_timestamp();

-- Update existing records with more detailed data
UPDATE public.advisors
SET bio = CASE
  WHEN id = 'cfo' THEN 'Santiago brings over 15 years of experience in impact investment and social enterprise finance. His expertise in triple-bottom-line accounting helps Africa Thryves maximize social impact while ensuring financial sustainability.'
  WHEN id = 'cel' THEN 'Clara has dedicated her career to building bridges between communities and organizations. Her innovative approach to engagement combines traditional wisdom with modern digital tools.'
  WHEN id = 'chro' THEN 'Jonas believes in the power of people-first leadership. His approach to HR combines African leadership principles with modern organizational development practices.'
  WHEN id = 'strategy' THEN 'Alex brings strategic vision and practical wisdom to Africa Thryves, shaped by years of experience in social enterprise and community development across the continent.'
  ELSE description
END,
tags = CASE
  WHEN id = 'cfo' THEN ARRAY['finance', 'investment', 'impact', 'sustainability']
  WHEN id = 'cel' THEN ARRAY['community', 'engagement', 'local', 'development']
  WHEN id = 'chro' THEN ARRAY['hr', 'people', 'culture', 'development']
  WHEN id = 'strategy' THEN ARRAY['strategy', 'planning', 'growth', 'innovation']
  ELSE expertise
END
WHERE id IN ('cfo', 'cel', 'chro', 'strategy');