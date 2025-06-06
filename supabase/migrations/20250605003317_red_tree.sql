-- Create mental_game_traits table
CREATE TABLE IF NOT EXISTS mental_game_traits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_type text NOT NULL CHECK (profile_type IN ('a', 'b', 'c', 'd')),
  trait_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE mental_game_traits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert own mental game traits"
  ON mental_game_traits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own mental game traits"
  ON mental_game_traits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mental game traits"
  ON mental_game_traits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);