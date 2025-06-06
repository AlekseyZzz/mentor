/*
  # Add Progress Metrics Tables

  1. New Tables
    - `progress_metrics`
      - Stores daily/weekly progress metrics
      - Tracks mental game scores, focus ratings, and tilt events
    - `progress_goals`
      - Stores user goals and milestones
      - Tracks completion status and deadlines

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create progress_metrics table
CREATE TABLE IF NOT EXISTS progress_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE,
  mental_game_score integer CHECK (mental_game_score BETWEEN 0 AND 100),
  focus_rating integer CHECK (focus_rating BETWEEN 0 AND 100),
  tilt_control_score integer CHECK (tilt_control_score BETWEEN 0 AND 100),
  session_count integer DEFAULT 0,
  total_minutes integer DEFAULT 0,
  a_game_percentage integer CHECK (a_game_percentage BETWEEN 0 AND 100),
  created_at timestamptz DEFAULT now()
);

-- Create progress_goals table
CREATE TABLE IF NOT EXISTS progress_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  target_value integer,
  current_value integer DEFAULT 0,
  deadline date,
  completed boolean DEFAULT false,
  tasks jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE progress_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for progress_metrics
CREATE POLICY "Users can view own progress metrics"
  ON progress_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress metrics"
  ON progress_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress metrics"
  ON progress_metrics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for progress_goals
CREATE POLICY "Users can view own goals"
  ON progress_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON progress_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON progress_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);