-- User profiles for company context
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  industry text,
  company_size text,
  company_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Boardroom sessions storage
CREATE TABLE IF NOT EXISTS boardroom_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  selected_advisors text[] NOT NULL DEFAULT '{}',
  round1_responses jsonb DEFAULT '[]',
  round2_responses jsonb DEFAULT '[]',
  suggested_questions text[] DEFAULT '{}',
  follow_ups jsonb DEFAULT '[]',
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE boardroom_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own sessions
CREATE POLICY "Users can view own sessions" ON boardroom_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON boardroom_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON boardroom_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Index for fast session lookup
CREATE INDEX idx_boardroom_sessions_user_id ON boardroom_sessions(user_id);
CREATE INDEX idx_boardroom_sessions_created_at ON boardroom_sessions(created_at DESC);
