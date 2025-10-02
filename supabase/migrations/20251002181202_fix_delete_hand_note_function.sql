/*
  # Fix delete_hand_note function to bypass RLS properly
  
  1. Changes
    - Recreate function with proper RLS bypass using direct table access
    - Disable RLS checks within function using set_config
  
  2. Security
    - Function still validates user ownership before deletion
    - Uses SECURITY DEFINER to bypass RLS for both SELECT and DELETE
*/

-- Drop and recreate the function with proper RLS bypass
DROP FUNCTION IF EXISTS delete_hand_note(uuid);

CREATE OR REPLACE FUNCTION delete_hand_note(note_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  note_user_id uuid;
BEGIN
  -- Get the user_id of the hand note without RLS restrictions
  SELECT user_id INTO note_user_id
  FROM hand_notes 
  WHERE id = note_id;
  
  -- Check if note exists
  IF note_user_id IS NULL THEN
    RAISE EXCEPTION 'Hand note not found';
  END IF;
  
  -- Verify ownership
  IF note_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Delete the hand note (CASCADE will handle screenshot_notes)
  DELETE FROM hand_notes WHERE id = note_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_hand_note(uuid) TO authenticated;

COMMENT ON FUNCTION delete_hand_note IS 
'Deletes a hand note and cascades to screenshot_notes. Validates user ownership. Bypasses RLS.';
