/*
  # Fix screenshot_notes CASCADE delete with RLS
  
  1. Changes
    - Update DELETE policy to support CASCADE delete from hand_notes
    - Allow deletion if user owns the parent hand_note
  
  2. Security
    - Users can delete screenshot notes they own directly
    - Users can delete screenshot notes via CASCADE when deleting parent hand_note
*/

DROP POLICY IF EXISTS "Users can delete own screenshot notes" ON screenshot_notes;

CREATE POLICY "Users can delete own screenshot notes"
  ON screenshot_notes
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM hand_notes 
      WHERE hand_notes.id = screenshot_notes.hand_note_id 
      AND hand_notes.user_id = auth.uid()
    )
  );
