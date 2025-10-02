/*
  # Add screenshot notes functionality

  1. New Tables
    - `screenshot_notes`
      - `id` (uuid, primary key)
      - `hand_note_id` (uuid, foreign key to hand_notes)
      - `screenshot_url` (text)
      - `note` (text)
      - `screenshot_type` (text) - 'hand' or 'wizard'
      - `display_order` (integer)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `screenshot_notes` table
    - Add policies for authenticated users to manage their own screenshot notes
*/

CREATE TABLE IF NOT EXISTS screenshot_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hand_note_id uuid REFERENCES hand_notes(id) ON DELETE CASCADE,
  screenshot_url text NOT NULL,
  note text,
  screenshot_type text NOT NULL CHECK (screenshot_type IN ('hand', 'wizard')),
  display_order integer NOT NULL DEFAULT 0,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE screenshot_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own screenshot notes"
  ON screenshot_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own screenshot notes"
  ON screenshot_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own screenshot notes"
  ON screenshot_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own screenshot notes"
  ON screenshot_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_screenshot_notes_hand_note_id ON screenshot_notes(hand_note_id);
CREATE INDEX IF NOT EXISTS idx_screenshot_notes_user_id ON screenshot_notes(user_id);