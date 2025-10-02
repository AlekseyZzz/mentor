/*
  # Add SELECT policy for soft-deleted records needed for deletion
  
  1. Changes
    - Add new SELECT policy that allows users to see their own deleted records
    - This is needed so the delete function can verify ownership before deletion
  
  2. Security
    - Users can only see their own deleted records
    - Policy is separate from main SELECT policy to maintain security
*/

-- Add policy to allow users to SELECT their own deleted records
-- This is needed for the delete function to work properly
CREATE POLICY "Users can view own deleted hand notes for cleanup"
  ON hand_notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NOT NULL);
