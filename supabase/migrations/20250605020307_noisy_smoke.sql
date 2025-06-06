/*
  # Add hand analysis and mental game traits tables
  
  1. New Tables
    - hand_analysis: Stores detailed hand analysis data
    - mental_game_traits: Stores user-defined mental game traits
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create hand_analysis table if it doesn't exist
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

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view own hand analysis" ON hand_analysis;
  DROP POLICY IF EXISTS "Users can insert own hand analysis" ON hand_analysis;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create policies
CREATE POLICY "Users can view own hand analysis"
  ON hand_analysis
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hand analysis"
  ON hand_analysis
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create mental_game_traits table if it doesn't exist
CREATE TABLE IF NOT EXISTS mental_game_traits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_type text NOT NULL CHECK (profile_type IN ('a', 'b', 'c', 'd')),
  trait_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE mental_game_traits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view own mental game traits" ON mental_game_traits;
  DROP POLICY IF EXISTS "Users can insert own mental game traits" ON mental_game_traits;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create policies
CREATE POLICY "Users can view own mental game traits"
  ON mental_game_traits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mental game traits"
  ON mental_game_traits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);