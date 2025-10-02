/*
  # Add GTO Wizard Drill Script Field

  1. Changes
    - Add `wizard_drill_script` column to `hand_analysis` table for storing drill scripts
    - Add `wizard_drill_script` field to `hand_notes.back` JSONB structure (no schema change needed, JSONB is flexible)
  
  2. Purpose
    - Allows users to paste GTO Wizard drill scripts when analyzing hands
    - Users can copy the script to clipboard when viewing hand analysis
    - Field is optional and can be empty
  
  3. Notes
    - For `hand_analysis` table: Adding actual column
    - For `hand_notes` table: Will be stored in the `back` JSONB field, no migration needed
*/

-- Add wizard_drill_script column to hand_analysis table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hand_analysis' AND column_name = 'wizard_drill_script'
  ) THEN
    ALTER TABLE hand_analysis ADD COLUMN wizard_drill_script text;
  END IF;
END $$;
