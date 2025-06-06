/*
  # Post-Session Reflection Schema

  1. New Tables
    - `post_session_reflections`
      - Core session data
      - Mental game metrics
      - Reset checklist
      - Emotional reflection
    
    - `mental_game_notes`
      - Linked to session
      - Text observations
    
    - `hand_analysis`
      - Detailed hand review
      - Screenshots and theory
    
    - `mental_game_traits`
      - User-defined profile traits
      - Not session-specific

  2. Security
    - RLS enabled on all tables
    - Policies for authenticated users
*/

-- Create post_session_reflections table
CREATE TABLE IF NOT EXISTS post_session_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  minutes_played integer NOT NULL CHECK (minutes_played > 0),
  tables_played integer NOT NULL CHECK (tables_played > 0),
  energy_level text NOT NULL,
  mental_profiles text[] NOT NULL,
  dominant_profile text CHECK (dominant_profile IN ('a', 'b', 'c', 'd')),
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
  reset_checklist jsonb CHECK (jsonb_typeof(reset_checklist) = 'object'),
  reset_message text,
  c_game_moment_note text,
  session_date date DEFAULT CURRENT_DATE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create mental_game_notes table
CREATE TABLE IF NOT EXISTS mental_game_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES post_session_reflections(id) ON DELETE CASCADE NOT NULL,
  note_text text NOT NULL CHECK (char_length(note_text) <= 250),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create hand_analysis table
CREATE TABLE IF NOT EXISTS hand_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES post_session_reflections(id) ON DELETE CASCADE NOT NULL,
  screenshot_url text,
  hand_description text,
  initial_thought text,
  adaptive_thought text,
  spot_type text,
  position_dynamic text,
  tags text[],
  priority_level text CHECK (priority_level IN ('high', 'medium', 'low')),
  theory_attachments jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create mental_game_traits table
CREATE TABLE IF NOT EXISTS mental_game_traits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_type text NOT NULL CHECK (profile_type IN ('a', 'b', 'c', 'd')),
  trait_text text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE post_session_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_game_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hand_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_game_traits ENABLE ROW LEVEL SECURITY;

-- Create policies for post_session_reflections
CREATE POLICY "Users can view own reflections"
  ON post_session_reflections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections"
  ON post_session_reflections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for mental_game_notes
CREATE POLICY "Users can view own notes"
  ON mental_game_notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON mental_game_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for hand_analysis
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

-- Create policies for mental_game_traits
CREATE POLICY "Users can view own traits"
  ON mental_game_traits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own traits"
  ON mental_game_traits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_reflections_user_date ON post_session_reflections(user_id, session_date);
CREATE INDEX idx_notes_session ON mental_game_notes(session_id);
CREATE INDEX idx_hands_session ON hand_analysis(session_id);
CREATE INDEX idx_traits_user_profile ON mental_game_traits(user_id, profile_type);

-- Sample query to retrieve full session data
COMMENT ON TABLE post_session_reflections IS $DOC$
Sample query to retrieve full session data with related records:

SELECT 
  r.*,
  (
    SELECT json_agg(n.*)
    FROM mental_game_notes n
    WHERE n.session_id = r.id
  ) as mental_game_notes,
  (
    SELECT json_agg(h.*)
    FROM hand_analysis h
    WHERE h.session_id = r.id
  ) as hand_analysis,
  (
    SELECT json_agg(t.*)
    FROM mental_game_traits t
    WHERE t.user_id = r.user_id
    AND t.profile_type = ANY(r.mental_profiles)
  ) as mental_game_traits
FROM post_session_reflections r
WHERE r.user_id = auth.uid()
AND r.session_date = :date;
$DOC$;