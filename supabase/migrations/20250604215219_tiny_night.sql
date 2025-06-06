/*
  # User Profiles and Settings Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `language` (text)
      - `onboarding_completed` (boolean)
      - `hints_enabled` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `mental_game_scores`
      - `id` (uuid)
      - `user_id` (uuid, references auth.users)
      - `a_game_score` (integer)
      - `b_game_score` (integer)
      - `c_game_score` (integer)
      - `d_game_score` (integer)
      - `date` (date)
      - `created_at` (timestamp)

    - `session_reflections`
      - `id` (uuid)
      - `user_id` (uuid, references auth.users)
      - `mindset` (text)
      - `energy_level` (integer)
      - `focus_rating` (integer)
      - `notes` (text)
      - `date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  language text DEFAULT 'en' CHECK (language IN ('en', 'ru')),
  onboarding_completed boolean DEFAULT false,
  hints_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mental_game_scores table
CREATE TABLE IF NOT EXISTS mental_game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  a_game_score integer CHECK (a_game_score BETWEEN 0 AND 100),
  b_game_score integer CHECK (b_game_score BETWEEN 0 AND 100),
  c_game_score integer CHECK (c_game_score BETWEEN 0 AND 100),
  d_game_score integer CHECK (d_game_score BETWEEN 0 AND 100),
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create session_reflections table
CREATE TABLE IF NOT EXISTS session_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mindset text,
  energy_level integer CHECK (energy_level BETWEEN 1 AND 5),
  focus_rating integer CHECK (focus_rating BETWEEN 1 AND 5),
  notes text,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_reflections ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for mental_game_scores
CREATE POLICY "Users can view own mental game scores"
  ON mental_game_scores
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mental game scores"
  ON mental_game_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mental game scores"
  ON mental_game_scores
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for session_reflections
CREATE POLICY "Users can view own reflections"
  ON session_reflections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections"
  ON session_reflections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections"
  ON session_reflections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();