/*
  # Post-Session Reflection Schema

  1. New Tables
    - `post_session_reflections`
      - Core reflection data
      - Linked to user and pre-session
      - Includes all mental game metrics
  
  2. Security
    - Enable RLS
    - Add policies for data access
*/

-- Create post_session_reflections table
CREATE TABLE IF NOT EXISTS post_session_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pre_session_id uuid REFERENCES pre_session_protocols(id),
  minutes_played integer NOT NULL CHECK (minutes_played > 0),
  energy_level text NOT NULL,
  mental_profiles text[] NOT NULL,
  dominant_profile text,
  pre_session_done boolean NOT NULL DEFAULT false,
  skip_reason text,
  pre_session_feeling text,
  had_strong_emotions boolean,
  emotion text,
  emotion_trigger text,
  emotion_thoughts text,
  valid_reaction text,
  exaggerated_reaction text,
  future_response text,
  reset_checklist jsonb,
  reset_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE post_session_reflections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert own post-session reflections"
  ON post_session_reflections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own post-session reflections"
  ON post_session_reflections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own post-session reflections"
  ON post_session_reflections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);