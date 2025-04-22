/*
  # Messages and Conversations Schema

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `advisor_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `status` (text) - inbox, pending, consider, archived
      - `title` (text)
      - `preview` (text)
    
    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, references conversations)
      - `role` (text) - user or advisor
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read their own conversations and messages
      - Create new conversations and messages
      - Update conversation status
*/

-- Create conversations table
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  advisor_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'inbox',
  title text NOT NULL,
  preview text,
  CONSTRAINT valid_status CHECK (status IN ('inbox', 'pending', 'consider', 'archived'))
);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations ON DELETE CASCADE NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('user', 'advisor'))
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for conversations
CREATE POLICY "Users can view own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for messages
CREATE POLICY "Users can view messages in own conversations"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Function to update conversation updated_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp when new message is added
CREATE TRIGGER update_conversation_timestamp
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();