/*
  # Create meetings table

  1. New Tables
    - `meetings`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `start_time` (timestamptz, required)
      - `end_time` (timestamptz, required)
      - `attendees` (text[], required)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on meetings table
    - Add policies for authenticated users to:
      - Create meetings
      - Read all meetings
      - Update/delete their own meetings
*/

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  attendees text[] NOT NULL DEFAULT '{}',
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  
  -- Add constraint to ensure end_time is after start_time
  CONSTRAINT valid_meeting_times CHECK (end_time > start_time)
);

-- Enable RLS
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create meetings"
  ON meetings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view all meetings"
  ON meetings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own meetings"
  ON meetings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own meetings"
  ON meetings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create index for faster queries
CREATE INDEX meetings_start_time_idx ON meetings (start_time);