/*
  # Add UPDATE and DELETE policies for hand_analysis table
  
  1. Changes
    - Add UPDATE policy for hand_analysis table allowing users to update their own records
    - Add DELETE policy for hand_analysis table allowing users to delete their own records
    
  2. Security
    - Both policies check that auth.uid() matches user_id
    - Only authenticated users can perform these operations
    - Users can only modify/delete their own hand analysis records
*/

DO $$ 
BEGIN
  -- Add UPDATE policy for hand_analysis
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hand_analysis' 
    AND policyname = 'Users can update own hand analysis'
  ) THEN
    CREATE POLICY "Users can update own hand analysis"
      ON hand_analysis
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Add DELETE policy for hand_analysis
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hand_analysis' 
    AND policyname = 'Users can delete own hand analysis'
  ) THEN
    CREATE POLICY "Users can delete own hand analysis"
      ON hand_analysis
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;