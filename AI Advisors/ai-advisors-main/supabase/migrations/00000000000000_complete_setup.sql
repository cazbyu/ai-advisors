-- ============================================================
-- AI BOARDROOM — Complete Database Setup (Private Schema)
-- ============================================================
-- All boardroom tables live in a "boardroom" schema,
-- keeping them separate from anything else in your public schema.
--
-- IMPORTANT: After running this, you must expose the "boardroom"
-- schema in your Supabase Dashboard:
--   Settings → API → Exposed schemas → Add "boardroom"
--
-- Go to: Supabase Dashboard → SQL Editor → New Query → Paste this → Run
-- ============================================================


-- ============================================================
-- STEP 1: Create the private schema
-- ============================================================

CREATE SCHEMA IF NOT EXISTS boardroom;

-- Grant usage so Supabase auth + API can reach it
GRANT USAGE ON SCHEMA boardroom TO anon, authenticated, service_role;

-- Grant table-level permissions (applies to future tables too)
ALTER DEFAULT PRIVILEGES IN SCHEMA boardroom
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated, service_role;


-- ============================================================
-- TABLE 1: ADVISORS
-- ============================================================

CREATE TABLE IF NOT EXISTS boardroom.advisors (
  id text PRIMARY KEY,
  title text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  avatar text NOT NULL,
  profile_image text NOT NULL DEFAULT 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets/default-profile.png',
  description text NOT NULL,
  expertise text[] NOT NULL DEFAULT '{}',
  team jsonb,
  gpt_link text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS advisors_role_idx ON boardroom.advisors (role);

ALTER TABLE boardroom.advisors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to view advisors" ON boardroom.advisors;
CREATE POLICY "Allow authenticated users to view advisors"
  ON boardroom.advisors FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow admin users to manage advisors" ON boardroom.advisors;
CREATE POLICY "Allow admin users to manage advisors"
  ON boardroom.advisors
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE OR REPLACE FUNCTION boardroom.set_default_profile_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.profile_image IS NULL THEN
    NEW.profile_image := 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets/default-profile.png';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_profile_image ON boardroom.advisors;
CREATE TRIGGER ensure_profile_image
  BEFORE INSERT OR UPDATE ON boardroom.advisors
  FOR EACH ROW
  EXECUTE FUNCTION boardroom.set_default_profile_image();


-- ============================================================
-- TABLE 2: CONVERSATIONS (1-on-1 advisor chats — legacy)
-- ============================================================

CREATE TABLE IF NOT EXISTS boardroom.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  advisor_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'inbox',
  title text NOT NULL,
  preview text,
  CONSTRAINT valid_status CHECK (status IN ('inbox', 'pending', 'consider', 'archived'))
);

ALTER TABLE boardroom.conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own conversations" ON boardroom.conversations;
CREATE POLICY "Users can view own conversations"
  ON boardroom.conversations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create conversations" ON boardroom.conversations;
CREATE POLICY "Users can create conversations"
  ON boardroom.conversations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own conversations" ON boardroom.conversations;
CREATE POLICY "Users can update own conversations"
  ON boardroom.conversations FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- TABLE 3: MESSAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS boardroom.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES boardroom.conversations(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('user', 'advisor'))
);

ALTER TABLE boardroom.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in own conversations" ON boardroom.messages;
CREATE POLICY "Users can view messages in own conversations"
  ON boardroom.messages FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM boardroom.conversations
    WHERE boardroom.conversations.id = boardroom.messages.conversation_id
    AND boardroom.conversations.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can create messages in own conversations" ON boardroom.messages;
CREATE POLICY "Users can create messages in own conversations"
  ON boardroom.messages FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM boardroom.conversations
    WHERE boardroom.conversations.id = boardroom.messages.conversation_id
    AND boardroom.conversations.user_id = auth.uid()
  ));

CREATE OR REPLACE FUNCTION boardroom.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE boardroom.conversations
  SET updated_at = now(),
      preview = NEW.content
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_conversation_timestamp ON boardroom.messages;
CREATE TRIGGER update_conversation_timestamp
  AFTER INSERT ON boardroom.messages
  FOR EACH ROW
  EXECUTE FUNCTION boardroom.update_conversation_timestamp();


-- ============================================================
-- TABLE 4: MEETINGS (legacy)
-- ============================================================

CREATE TABLE IF NOT EXISTS boardroom.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  attendees text[] NOT NULL DEFAULT '{}',
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_meeting_times CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS meetings_start_time_idx ON boardroom.meetings (start_time);

ALTER TABLE boardroom.meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create meetings" ON boardroom.meetings;
CREATE POLICY "Users can create meetings"
  ON boardroom.meetings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can view all meetings" ON boardroom.meetings;
CREATE POLICY "Users can view all meetings"
  ON boardroom.meetings FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update own meetings" ON boardroom.meetings;
CREATE POLICY "Users can update own meetings"
  ON boardroom.meetings FOR UPDATE TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete own meetings" ON boardroom.meetings;
CREATE POLICY "Users can delete own meetings"
  ON boardroom.meetings FOR DELETE TO authenticated
  USING (auth.uid() = created_by);


-- ============================================================
-- TABLE 5: USER PROFILES (company context)
-- ============================================================

CREATE TABLE IF NOT EXISTS boardroom.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  industry text,
  company_size text,
  company_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE boardroom.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON boardroom.user_profiles;
CREATE POLICY "Users can view own profile"
  ON boardroom.user_profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON boardroom.user_profiles;
CREATE POLICY "Users can insert own profile"
  ON boardroom.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON boardroom.user_profiles;
CREATE POLICY "Users can update own profile"
  ON boardroom.user_profiles FOR UPDATE USING (auth.uid() = id);


-- ============================================================
-- TABLE 6: BOARDROOM SESSIONS (the main feature)
-- ============================================================

CREATE TABLE IF NOT EXISTS boardroom.sessions (
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

ALTER TABLE boardroom.sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own sessions" ON boardroom.sessions;
CREATE POLICY "Users can view own sessions"
  ON boardroom.sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own sessions" ON boardroom.sessions;
CREATE POLICY "Users can insert own sessions"
  ON boardroom.sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own sessions" ON boardroom.sessions;
CREATE POLICY "Users can update own sessions"
  ON boardroom.sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON boardroom.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON boardroom.sessions(created_at DESC);


-- ============================================================
-- SEED DATA: Insert all 8 advisors
-- ============================================================

INSERT INTO boardroom.advisors (id, title, name, role, avatar, profile_image, description, expertise) VALUES

('cfo',
  'Santiago Marín, Chief Financial Officer',
  'Santiago Marín',
  'CFO',
  'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CFO_Santiago.png',
  'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CFO_Santiago.png',
  'Analytical financial leader focused on sustainable growth, ROI clarity, and risk management.',
  ARRAY['Financial Strategy', 'Impact Investment', 'Risk Management', 'Social ROI']
),

('cmo',
  'Elena Vasquez, Chief Marketing Officer',
  'Elena Vasquez',
  'CMO',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  'Customer-obsessed brand strategist who turns market insight into growth.',
  ARRAY['Marketing Strategy', 'Brand Development', 'Customer Insights', 'Go-to-Market']
),

('cto',
  'Marcus Chen, Chief Technology Officer',
  'Marcus Chen',
  'CTO',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'Pragmatic technologist who builds scalable solutions and speaks truth about timelines.',
  ARRAY['Tech Strategy', 'Innovation', 'Digital Transformation', 'Architecture']
),

('coo',
  'Isabella Torres, Chief Operating Officer',
  'Isabella Torres',
  'COO',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  'Execution-focused operator who turns strategy into reality.',
  ARRAY['Operations Management', 'Process Optimization', 'Supply Chain', 'Team Leadership']
),

('strategy',
  'Alexander Reid, Chief Strategy Officer',
  'Alexander Reid',
  'CSO',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
  'Big-picture strategist who connects dots and challenges short-term thinking.',
  ARRAY['Strategic Planning', 'Market Analysis', 'Competitive Intelligence', 'Growth Strategy']
),

('cio',
  'Grace Okafor, Chief Impact Officer',
  'Grace Okafor',
  'CIO',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  'Values-driven leader ensuring decisions create sustainable, meaningful impact.',
  ARRAY['Impact Assessment', 'Sustainability', 'Social Innovation', 'Community Development']
),

('cel',
  'Clara Reynolds, Community Engagement Lead',
  'Clara Reynolds',
  'CEL',
  'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CEL_Clara.png',
  'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CEL_Clara.png',
  'Grassroots connector who brings the voice of communities into the boardroom.',
  ARRAY['Community Engagement', 'Mobile-First Strategy', 'Cultural Integration', 'Local Initiatives']
),

('chro',
  'Jonas Thandi, Chief Human Resources Officer',
  'Jonas Thandi',
  'CHRO',
  'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CHRO_Jonas.png',
  'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CHRO_Jonas.png',
  'People-centered leader who builds culture, trust, and organizational readiness.',
  ARRAY['Values-based Leadership', 'Organizational Development', 'Employee Wellbeing', 'Inclusive Practices']
)

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  avatar = EXCLUDED.avatar,
  profile_image = EXCLUDED.profile_image,
  description = EXCLUDED.description,
  expertise = EXCLUDED.expertise;


-- ============================================================
-- DONE! Your database is ready.
--
-- NEXT: Expose the schema in the Supabase Dashboard:
--   Settings → API → Exposed schemas → Add "boardroom"
--
-- Then continue with:
--   1. Add your ANTHROPIC_API_KEY in Edge Function Secrets
--   2. Deploy the boardroom-discuss edge function
--   3. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
--   4. Run: npm run dev
-- ============================================================
