/*
  # Add profile images to advisors table

  1. Changes
    - Add profile_image column to advisors table
    - Update existing records with profile images
    - Add fallback trigger for missing profile images

  2. Security
    - Maintain existing RLS policies
*/

-- Add profile_image column
ALTER TABLE public.advisors
ADD COLUMN IF NOT EXISTS profile_image text NOT NULL 
DEFAULT 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets/default-profile.png';

-- Update existing records with profile images
UPDATE public.advisors
SET profile_image = CASE
  WHEN id = 'cfo' THEN 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets/AI%20Advisor_CFO_Santiago.png'
  WHEN id = 'cel' THEN 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets/AI%20Advisor_CEL_Clara.png'
  WHEN id = 'chro' THEN 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets/AI%20Advisor_CHRO_Jonas.png'
  WHEN id = 'strategy' THEN 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets/AI%20Advisor_CSO_Alex.png'
  ELSE avatar
END;

-- Create function to ensure profile_image is never null
CREATE OR REPLACE FUNCTION set_default_profile_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.profile_image IS NULL THEN
    NEW.profile_image := 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets/default-profile.png';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set default profile image
DROP TRIGGER IF EXISTS ensure_profile_image ON public.advisors;
CREATE TRIGGER ensure_profile_image
  BEFORE INSERT OR UPDATE ON public.advisors
  FOR EACH ROW
  EXECUTE FUNCTION set_default_profile_image();