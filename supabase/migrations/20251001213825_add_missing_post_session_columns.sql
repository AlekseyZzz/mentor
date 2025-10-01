/*
  # Add Missing Columns to post_session_reflections

  1. Changes
    - Add `session_date` column (date type) to store the session date
    - Add `tables_played` column (integer type) to track number of tables played
    - Add `game_level_self_rating` column if not exists
    - Add `non_a_game_reasons` column if not exists
    - Add `rescue_attempted` column if not exists
    - Add `rescue_strategy` column if not exists

  2. Notes
    - All columns are nullable to maintain backward compatibility
    - session_date defaults to current date
*/

-- Add session_date column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'post_session_reflections' AND column_name = 'session_date'
  ) THEN
    ALTER TABLE post_session_reflections ADD COLUMN session_date date DEFAULT CURRENT_DATE;
  END IF;
END $$;

-- Add tables_played column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'post_session_reflections' AND column_name = 'tables_played'
  ) THEN
    ALTER TABLE post_session_reflections ADD COLUMN tables_played integer DEFAULT 1;
  END IF;
END $$;

-- Add game_level_self_rating column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'post_session_reflections' AND column_name = 'game_level_self_rating'
  ) THEN
    ALTER TABLE post_session_reflections ADD COLUMN game_level_self_rating text CHECK (game_level_self_rating IN ('a', 'b', 'c', 'd'));
  END IF;
END $$;

-- Add non_a_game_reasons column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'post_session_reflections' AND column_name = 'non_a_game_reasons'
  ) THEN
    ALTER TABLE post_session_reflections ADD COLUMN non_a_game_reasons text[];
  END IF;
END $$;

-- Add rescue_attempted column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'post_session_reflections' AND column_name = 'rescue_attempted'
  ) THEN
    ALTER TABLE post_session_reflections ADD COLUMN rescue_attempted boolean DEFAULT false;
  END IF;
END $$;

-- Add rescue_strategy column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'post_session_reflections' AND column_name = 'rescue_strategy'
  ) THEN
    ALTER TABLE post_session_reflections ADD COLUMN rescue_strategy text;
  END IF;
END $$;