-- Create hand_analysis table
CREATE TABLE IF NOT EXISTS hand_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES post_session_reflections(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  screenshot_url text,
  hand_description text,
  initial_thought text,
  adaptive_thought text,
  spot_type text,
  position_dynamic text,
  tags text[],
  priority_level text CHECK (priority_level IN ('high', 'medium', 'low')),
  theory_attachments jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE hand_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert own hand analysis"
  ON hand_analysis
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own hand analysis"
  ON hand_analysis
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own hand analysis"
  ON hand_analysis
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);