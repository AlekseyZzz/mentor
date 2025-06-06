-- Create mental_game_notes table
CREATE TABLE IF NOT EXISTS mental_game_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES post_session_reflections(id) ON DELETE CASCADE NOT NULL,
  note_text text NOT NULL CHECK (char_length(note_text) <= 250),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE mental_game_notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert own mental game notes"
  ON mental_game_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own mental game notes"
  ON mental_game_notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mental game notes"
  ON mental_game_notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);