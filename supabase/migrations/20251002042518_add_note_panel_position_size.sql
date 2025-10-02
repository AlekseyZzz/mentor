/*
  # Add position and size tracking for screenshot note panels

  1. Changes
    - Add `panel_x` column (integer) - X position of the note panel
    - Add `panel_y` column (integer) - Y position of the note panel
    - Add `panel_width` column (integer) - Width of the note panel
    - Add `panel_height` column (integer) - Height of the note panel
  
  2. Purpose
    - Store the last position and size of each draggable note panel
    - Restore panels to their previous position when reopened
    - Improve user experience by remembering layout preferences
  
  3. Notes
    - All columns are nullable (NULL = use default position/size)
    - Default values are not set in DB, handled by frontend
    - Position is stored in pixels relative to viewport
*/

-- Add position and size columns to screenshot_notes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'screenshot_notes' AND column_name = 'panel_x'
  ) THEN
    ALTER TABLE screenshot_notes ADD COLUMN panel_x integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'screenshot_notes' AND column_name = 'panel_y'
  ) THEN
    ALTER TABLE screenshot_notes ADD COLUMN panel_y integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'screenshot_notes' AND column_name = 'panel_width'
  ) THEN
    ALTER TABLE screenshot_notes ADD COLUMN panel_width integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'screenshot_notes' AND column_name = 'panel_height'
  ) THEN
    ALTER TABLE screenshot_notes ADD COLUMN panel_height integer;
  END IF;
END $$;
