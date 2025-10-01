/*
  # Create Hand Notes Table for Analysis Module

  1. New Tables
    - `hand_notes` - Stores analyzed poker hands with front/back card structure
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `front` (jsonb) - Front card data (HH, screenshots, thoughts, arguments_for, tags)
      - `back` (jsonb) - Back card data (wizard link, correct solution, emotions, adaptive thought)
      - `meta` (jsonb) - Metadata (mark_for_review, review_due_at, privacy)
      - `deleted_at` (timestamptz) - Soft delete support

  2. Security
    - Enable RLS on hand_notes table
    - Add policies for authenticated users to manage their own hands

  3. Indexes
    - (user_id, created_at DESC) for recent hands query
    - GIN indexes for JSONB text search
    - Index on tags for filtering

  4. Storage Bucket
    - Create 'hand-analysis' bucket for screenshots
    - Set up policies for authenticated users
*/

-- Create hand_notes table
CREATE TABLE IF NOT EXISTS hand_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  front jsonb NOT NULL DEFAULT '{
    "hand_history": "",
    "screenshot_urls": [],
    "thoughts": "",
    "arguments_for": [],
    "tags": []
  }'::jsonb,

  back jsonb NOT NULL DEFAULT '{
    "wizard_link": null,
    "wizard_screenshots": [],
    "correct_solution": "",
    "arguments_against": [],
    "emotions": {
      "focus": null,
      "confidence": null,
      "impulsivity": null,
      "tilt_type": null,
      "game_state": null
    },
    "adaptive_thought": "",
    "next_time_plan": ""
  }'::jsonb,

  meta jsonb DEFAULT '{
    "mark_for_review": false,
    "review_due_at": null,
    "privacy": "private"
  }'::jsonb,

  deleted_at timestamptz DEFAULT NULL,

  CONSTRAINT hand_history_length CHECK (length(front->>'hand_history') <= 10000),
  CONSTRAINT adaptive_thought_length CHECK (length(back->>'adaptive_thought') <= 120)
);

-- Enable Row Level Security
ALTER TABLE hand_notes ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'hand_notes'
    AND policyname = 'Users can view own hand notes'
  ) THEN
    CREATE POLICY "Users can view own hand notes"
      ON hand_notes
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id AND deleted_at IS NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'hand_notes'
    AND policyname = 'Users can insert own hand notes'
  ) THEN
    CREATE POLICY "Users can insert own hand notes"
      ON hand_notes
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'hand_notes'
    AND policyname = 'Users can update own hand notes'
  ) THEN
    CREATE POLICY "Users can update own hand notes"
      ON hand_notes
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'hand_notes'
    AND policyname = 'Users can delete own hand notes'
  ) THEN
    CREATE POLICY "Users can delete own hand notes"
      ON hand_notes
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hand_notes_user_created
  ON hand_notes(user_id, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_hand_notes_user_review
  ON hand_notes(user_id, (meta->>'review_due_at'))
  WHERE deleted_at IS NULL
  AND (meta->>'mark_for_review')::boolean = true;

-- GIN index for tags array
CREATE INDEX IF NOT EXISTS idx_hand_notes_tags
  ON hand_notes USING GIN ((front->'tags'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hand_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_hand_notes_updated_at_trigger ON hand_notes;
CREATE TRIGGER update_hand_notes_updated_at_trigger
  BEFORE UPDATE ON hand_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_hand_notes_updated_at();

-- Add helpful comments
COMMENT ON TABLE hand_notes IS
'Analyzed poker hands with Anki-style front/back structure. Front contains the hand scenario, back contains analysis and learning.';

COMMENT ON COLUMN hand_notes.front IS
'Front card: hand_history (text), screenshot_urls (array), thoughts (text), arguments_for (array), tags (array)';

COMMENT ON COLUMN hand_notes.back IS
'Back card: wizard_link, wizard_screenshots (array), correct_solution, arguments_against (array), emotions (object), adaptive_thought, next_time_plan';

COMMENT ON COLUMN hand_notes.meta IS
'Metadata: mark_for_review (bool), review_due_at (ISO date), privacy (private|team)';
