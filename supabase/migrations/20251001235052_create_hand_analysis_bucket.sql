/*
  # Create Storage Bucket for Hand Analysis

  1. Storage
    - Create 'hand-analysis' bucket
    - Set up policies for authenticated users to upload/read their own files

  2. Security
    - Users can only upload to their own folders
    - Users can read their own uploaded files
*/

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('hand-analysis', 'hand-analysis', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload to their own folder
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname = 'Users can upload hand analysis files'
  ) THEN
    CREATE POLICY "Users can upload hand analysis files"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'hand-analysis' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

-- Policy: Allow authenticated users to read their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname = 'Users can read own hand analysis files'
  ) THEN
    CREATE POLICY "Users can read own hand analysis files"
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'hand-analysis' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

-- Policy: Allow authenticated users to delete their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname = 'Users can delete own hand analysis files'
  ) THEN
    CREATE POLICY "Users can delete own hand analysis files"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'hand-analysis' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

-- Policy: Allow public read access (for sharing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname = 'Public read access for hand analysis'
  ) THEN
    CREATE POLICY "Public read access for hand analysis"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'hand-analysis');
  END IF;
END $$;
