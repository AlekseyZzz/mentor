/*
  # Add missing UPDATE and DELETE policies for session tables
  
  1. Changes
    - Add UPDATE and DELETE policies for post_session_reflections
    - Add UPDATE and DELETE policies for mental_game_notes
    
  2. Security
    - All policies check that auth.uid() matches user_id
    - Only authenticated users can perform these operations
    - Users can only modify/delete their own records
*/

DO $$ 
BEGIN
  -- Policies for post_session_reflections
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_session_reflections' 
    AND policyname = 'Users can update own reflections'
  ) THEN
    CREATE POLICY "Users can update own reflections"
      ON post_session_reflections
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_session_reflections' 
    AND policyname = 'Users can delete own reflections'
  ) THEN
    CREATE POLICY "Users can delete own reflections"
      ON post_session_reflections
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Policies for mental_game_notes
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'mental_game_notes' 
    AND policyname = 'Users can update own notes'
  ) THEN
    CREATE POLICY "Users can update own notes"
      ON mental_game_notes
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'mental_game_notes' 
    AND policyname = 'Users can delete own notes'
  ) THEN
    CREATE POLICY "Users can delete own notes"
      ON mental_game_notes
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;