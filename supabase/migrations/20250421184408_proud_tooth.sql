/*
  # Create advisors table

  1. New Tables
    - `advisors`
      - `id` (text, primary key) - Unique identifier for the advisor
      - `title` (text) - Advisor's title
      - `name` (text) - Advisor's name
      - `role` (text) - Advisor's role
      - `avatar` (text) - URL to advisor's avatar image
      - `description` (text) - Detailed description of the advisor
      - `expertise` (text[]) - Array of expertise/skills
      - `team` (jsonb) - JSON array of team members with their details
      - `gpt_link` (text, nullable) - Optional link to GPT configuration
      - `created_at` (timestamptz) - Timestamp of creation

  2. Security
    - Enable RLS on `advisors` table
    - Add policy for authenticated users to read advisor data
    - Add policy for admin users to manage advisor data

  3. Indexes
    - Index on role for faster sorting
*/

-- Create advisors table
CREATE TABLE IF NOT EXISTS public.advisors (
  id text PRIMARY KEY,
  title text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  avatar text NOT NULL,
  description text NOT NULL,
  expertise text[] NOT NULL DEFAULT '{}',
  team jsonb,
  gpt_link text,
  created_at timestamptz DEFAULT now()
);

-- Create index for role-based sorting
CREATE INDEX IF NOT EXISTS advisors_role_idx ON public.advisors (role);

-- Enable Row Level Security
ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to view advisors"
  ON public.advisors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin users to manage advisors"
  ON public.advisors
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Insert initial advisor data
INSERT INTO public.advisors (id, title, name, role, avatar, description, expertise, team) VALUES
('strategy', 'Chief Strategy Officer', 'Dr. Alexandra Chen', 'CSO', 
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
  'Expert in strategic planning and business transformation with over 20 years of experience.',
  ARRAY['Strategic Planning', 'Business Transformation', 'Innovation Management', 'Digital Strategy', 'Change Management'],
  '[
    {
      "id": "strategy-1",
      "name": "Sarah Martinez",
      "role": "Senior Strategy Analyst",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400",
      "description": "Specializes in market analysis and competitive intelligence",
      "expertise": ["Market Analysis", "Competitive Intelligence", "Strategic Planning"]
    },
    {
      "id": "strategy-2",
      "name": "Michael Chang",
      "role": "Innovation Director",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400",
      "description": "Leads innovation initiatives and digital transformation projects",
      "expertise": ["Innovation Management", "Digital Transformation", "Design Thinking"]
    }
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;