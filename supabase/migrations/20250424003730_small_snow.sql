/*
  # Re-apply RLS Policies for Document Index

  1. Security Changes
    - Re-create "Users can manage documents" policy on 0003_document_index
    - Ensure authenticated users can manage their documents
    - Maintain public read access for public documents

  2. Notes
    - No schema changes or table modifications
    - Only applying missing RLS policies
    - Existing data and structure preserved
*/

-- Re-create policy for authenticated users to manage documents
CREATE POLICY "Users can manage documents"
  ON "0003_document_index"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure public read access policy exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = '0003_document_index' 
    AND policyname = 'Public can view public documents'
  ) THEN
    CREATE POLICY "Public can view public documents"
      ON "0003_document_index"
      FOR SELECT
      TO public
      USING (access = 'public');
  END IF;
END $$;