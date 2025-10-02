/*
  # Add function for deleting hand notes with proper CASCADE
  
  1. Changes
    - Create SECURITY DEFINER function to handle deletion
    - Function bypasses RLS but validates ownership
    - Handles CASCADE delete of screenshot_notes automatically
  
  2. Security
    - Function validates user owns the hand_note before deletion
    - Uses SECURITY DEFINER to bypass RLS for CASCADE operations
*/

-- Create function to delete hand note
CREATE OR REPLACE FUNCTION delete_hand_note(note_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the user owns this hand note
  IF NOT EXISTS (
    SELECT 1 FROM hand_notes 
    WHERE id = note_id 
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Hand note not found or access denied';
  END IF;

  -- Delete the hand note (CASCADE will handle screenshot_notes)
  DELETE FROM hand_notes WHERE id = note_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_hand_note(uuid) TO authenticated;

COMMENT ON FUNCTION delete_hand_note IS 
'Deletes a hand note and cascades to screenshot_notes. Validates user ownership.';
