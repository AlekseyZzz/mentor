/*
  # Add UPDATE and DELETE policies for mental_game_traits table
  
  1. Changes
    - Add UPDATE policy for mental_game_traits allowing users to update their own traits
    - Add DELETE policy for mental_game_traits allowing users to delete their own traits
    
  2. Security
    - Both policies check that auth.uid() matches user_id
    - Only authenticated users can perform these operations
    - Users can only modify/delete their own mental game traits
*/

DO $$ 
BEGIN
  -- Add UPDATE policy for mental_game_traits
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'mental_game_traits' 
    AND policyname = 'Users can update own traits'
  ) THEN
    CREATE POLICY "Users can update own traits"
      ON mental_game_traits
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Add DELETE policy for mental_game_traits
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'mental_game_traits' 
    AND policyname = 'Users can delete own traits'
  ) THEN
    CREATE POLICY "Users can delete own traits"
      ON mental_game_traits
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;