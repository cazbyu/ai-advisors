/*
  # Document Management System Schema

  1. New Tables
    - `document_index`
      - `id` (uuid, primary key)
      - `project_id` (text)
      - `advisor` (text, references advisors.id)
      - `topic` (text)
      - `title` (text)
      - `version` (integer)
      - `file_url` (text)
      - `file_type` (text)
      - `display_name` (text)
      - `tags` (text[])
      - `access` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `document_index` table
    - Add policies for authenticated users to manage documents
    - Add policy for public read access to public documents
*/

CREATE TABLE IF NOT EXISTS document_index (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  advisor text REFERENCES advisors(id),
  topic text NOT NULL,
  title text NOT NULL,
  version integer DEFAULT 1,
  file_url text NOT NULL,
  file_type text NOT NULL,
  display_name text NOT NULL,
  tags text[] DEFAULT '{}',
  access text DEFAULT 'private',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE document_index ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage documents
CREATE POLICY "Users can manage documents"
  ON document_index
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow public read access to public documents
CREATE POLICY "Public can view public documents"
  ON document_index
  FOR SELECT
  TO public
  USING (access = 'public');

-- Update updated_at on document changes
CREATE TRIGGER update_document_index_updated_at
  BEFORE UPDATE ON document_index
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();