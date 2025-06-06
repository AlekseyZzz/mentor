/*
  # Mental Game Training Module Schema

  1. New Tables
    - `training_lessons`
      - Core lesson content and metadata
      - Structured curriculum organization
      - Content types: text, reflection, interactive
    
    - `user_training_progress`
      - Track user progress through lessons
      - Store completion status and reflections
      - Enable spaced repetition

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users
    - Secure lesson access control

  3. Changes
    - Add training-specific fields to user_profiles
    - Create indexes for performance
*/

-- Create training_lessons table
CREATE TABLE IF NOT EXISTS training_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content_type text NOT NULL CHECK (content_type IN ('text', 'reflection', 'interactive', 'review')),
  content_body text NOT NULL,
  week_number integer NOT NULL CHECK (week_number BETWEEN 1 AND 6),
  day_number integer NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  tags text[] DEFAULT ARRAY[]::text[],
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_minutes integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_training_progress table
CREATE TABLE IF NOT EXISTS user_training_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES training_lessons(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamptz,
  understanding_rating integer CHECK (understanding_rating BETWEEN 1 AND 5),
  reflection_notes text,
  next_review_date date,
  review_interval integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Add training-specific fields to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS current_week integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_day integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS training_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_training_date date;

-- Enable RLS
ALTER TABLE training_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_training_progress ENABLE ROW LEVEL SECURITY;

-- Policies for training_lessons
CREATE POLICY "Anyone can view lessons"
  ON training_lessons
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_training_progress
CREATE POLICY "Users can view own progress"
  ON user_training_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_training_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify own progress"
  ON user_training_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_week_day ON training_lessons(week_number, day_number);
CREATE INDEX IF NOT EXISTS idx_user_progress_next_review ON user_training_progress(user_id, next_review_date);
CREATE INDEX IF NOT EXISTS idx_user_progress_completion ON user_training_progress(user_id, completed_at);