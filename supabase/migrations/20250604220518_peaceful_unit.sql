/*
  # Pre-Session Protocol Table

  1. New Tables
    - `pre_session_protocols`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `long_term_goal` (text)
      - `goal_meaning` (text)
      - `primary_focus_area` (text)
      - `session_focus` (text)
      - `meditation_duration` (integer, nullable)
      - `mental_state_score` (integer)
      - `energy_level_score` (integer)
      - `sleep_quality` (integer)
      - `emotional_state` (text)
      - `a_game_description` (text)
      - `mental_anchor` (text)
      - `tilt_triggers` (text)
      - `tilt_response` (text)
      - `game_type` (text)
      - `stakes_or_buyin` (text)
      - `planned_duration` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create pre_session_protocols table
CREATE TABLE IF NOT EXISTS pre_session_protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  long_term_goal text,
  goal_meaning text,
  primary_focus_area text,
  session_focus text,
  meditation_duration integer,
  mental_state_score integer CHECK (mental_state_score BETWEEN 1 AND 5),
  energy_level_score integer CHECK (energy_level_score BETWEEN 1 AND 5),
  sleep_quality integer CHECK (sleep_quality BETWEEN 1 AND 5),
  emotional_state text,
  a_game_description text,
  mental_anchor text,
  tilt_triggers text,
  tilt_response text,
  game_type text,
  stakes_or_buyin text,
  planned_duration text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pre_session_protocols ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert own pre-session protocols"
  ON pre_session_protocols
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own pre-session protocols"
  ON pre_session_protocols
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own pre-session protocols"
  ON pre_session_protocols
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);