/*
  # Add arguments columns to hand_analysis table

  1. Changes
    - Add `arguments_for_initial` column to store reasons supporting the initial thought
    - Add `arguments_against_initial` column to store reasons contradicting the initial thought
  
  2. Details
    - Both columns are text type and nullable
    - Allows players to analyze their thinking process more deeply
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hand_analysis' AND column_name = 'arguments_for_initial'
  ) THEN
    ALTER TABLE hand_analysis ADD COLUMN arguments_for_initial text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hand_analysis' AND column_name = 'arguments_against_initial'
  ) THEN
    ALTER TABLE hand_analysis ADD COLUMN arguments_against_initial text;
  END IF;
END $$;