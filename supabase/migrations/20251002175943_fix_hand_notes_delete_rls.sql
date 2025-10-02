/*
  # Fix hand_notes DELETE RLS policy
  
  1. Changes
    - Update DELETE policy to work with both soft and hard deletes
    - Remove dependency on SELECT policy for DELETE operations
  
  2. Security
    - Users can still only delete their own hand notes
    - Policy works regardless of deleted_at status
*/

DROP POLICY IF EXISTS "Users can delete own hand notes" ON hand_notes;

CREATE POLICY "Users can delete own hand notes"
  ON hand_notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
