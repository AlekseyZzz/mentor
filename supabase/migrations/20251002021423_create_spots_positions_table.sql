/*
  # Create Spots/Positions System

  1. New Tables
    - `spots_positions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, unique per user) - spot/position name
      - `use_count` (integer) - tracks popularity
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `spots_positions` table
    - Add policies for authenticated users to manage their spots
    
  3. Changes
    - No changes to hand_analysis table (already has spot_type and position_dynamic columns)
*/

-- Create spots_positions table
CREATE TABLE IF NOT EXISTS spots_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL CHECK (char_length(name) > 0 AND char_length(name) <= 100),
  use_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, name)
);

-- Enable Row Level Security
ALTER TABLE spots_positions ENABLE ROW LEVEL SECURITY;

-- Create policies for spots_positions
CREATE POLICY "Users can view own spots"
  ON spots_positions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spots"
  ON spots_positions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spots"
  ON spots_positions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own spots"
  ON spots_positions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_spots_positions_user ON spots_positions(user_id, name);
CREATE INDEX idx_spots_positions_usage ON spots_positions(user_id, use_count DESC);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_spots_positions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER spots_positions_updated_at
  BEFORE UPDATE ON spots_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_spots_positions_updated_at();