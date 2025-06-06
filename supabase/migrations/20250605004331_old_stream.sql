/*
  # Add c_game_moment_note column to post_session_reflections

  1. Changes
    - Add new column `c_game_moment_note` to `post_session_reflections` table
      - Type: text
      - Nullable: true
      - No default value

  2. Security
    - No changes to RLS policies needed as the existing policies will cover the new column
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'post_session_reflections' 
    AND column_name = 'c_game_moment_note'
  ) THEN
    ALTER TABLE post_session_reflections 
    ADD COLUMN c_game_moment_note text;
  END IF;
END $$;