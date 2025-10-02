/*
  # Final fix for delete_hand_note with complete RLS bypass
  
  1. Changes
    - Use ALTER TABLE to temporarily disable RLS within transaction
    - Perform validation and deletion
    - Re-enable RLS
  
  2. Security
    - Function is SECURITY DEFINER and owned by postgres superuser
    - Validates user ownership before deletion
    - Only authenticated users can execute
*/

-- Drop existing function
DROP FUNCTION IF EXISTS delete_hand_note(uuid);

-- Create function with complete RLS bypass using session-level settings
CREATE OR REPLACE FUNCTION delete_hand_note(note_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_user_id uuid;
  v_note_owner uuid;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check ownership (with RLS disabled via SET row_security = off)
  SELECT user_id INTO v_note_owner
  FROM hand_notes 
  WHERE id = note_id;
  
  -- Check if note exists
  IF v_note_owner IS NULL THEN
    RAISE EXCEPTION 'Hand note not found';
  END IF;
  
  -- Verify ownership
  IF v_note_owner != v_user_id THEN
    RAISE EXCEPTION 'Access denied: you do not own this hand note';
  END IF;

  -- Delete the hand note (CASCADE will handle screenshot_notes)
  DELETE FROM hand_notes WHERE id = note_id;
  
END;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION delete_hand_note(uuid) TO authenticated;

-- Explicitly revoke from other roles
REVOKE EXECUTE ON FUNCTION delete_hand_note(uuid) FROM anon, public;

COMMENT ON FUNCTION delete_hand_note IS 
'Deletes a hand note and cascades to screenshot_notes. Validates user ownership. RLS is disabled within function.';
