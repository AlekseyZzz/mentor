/*
  # Fix hand_notes delete policy

  1. Changes
    - Update the UPDATE policy for hand_notes to allow updating deleted_at field
    - This fixes soft delete functionality
  
  2. Security
    - Users can still only update their own hand notes
    - The policy now allows updating records even when deleted_at is set
*/

DROP POLICY IF EXISTS "Users can update own hand notes" ON hand_notes;

CREATE POLICY "Users can update own hand notes"
  ON hand_notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
