/*
  # Fix Schema Issues

  1. Changes
    - Add route column to advisors table
    - Create meetings table with proper structure
    - Add necessary indexes and constraints
    - Enable RLS on meetings table

  2. Security
    - Add RLS policies for meetings table
    - Maintain existing policies for advisors
*/

-- Add route column to advisors if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'advisors' AND column_name = 'route'
  ) THEN
    ALTER TABLE public.advisors
    ADD COLUMN route text GENERATED ALWAYS AS (LOWER(REPLACE(name, ' ', '-'))) STORED;
    
    CREATE INDEX IF NOT EXISTS advisors_route_idx ON public.advisors (route);
  END IF;
END $$;

-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id),
  advisor_id text REFERENCES public.advisors(id),
  user_id uuid REFERENCES auth.users(id),
  scheduled_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_meeting_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Enable RLS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Create policies for meetings
CREATE POLICY "Users can view own meetings"
  ON public.meetings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create meetings"
  ON public.meetings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meetings"
  ON public.meetings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS meetings_scheduled_time_idx ON public.meetings (scheduled_time);
CREATE INDEX IF NOT EXISTS meetings_user_id_idx ON public.meetings (user_id);
CREATE INDEX IF NOT EXISTS meetings_advisor_id_idx ON public.meetings (advisor_id);