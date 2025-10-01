/*
  # Update Caffeine to Scale System

  1. Changes
    - Replace physical_prep_caffeine boolean with caffeine_intake integer (0-3)
    - Add caffeine_penalty column to store calculated penalty
    - Update A-Game Score calculation to include caffeine penalty

  2. New Columns
    - caffeine_intake (integer 0-3) - Caffeine consumption level
      - 0 = None (clean baseline)
      - 1 = ≤1 standard portion (1 cup coffee/espresso)
      - 2 = 2-3 portions (latte + tea + cola/energy drink)
      - 3 = >3 portions / high-dose energy drinks
    - caffeine_penalty (integer) - Calculated penalty (-10 to 0)

  3. Notes
    - Penalty: 0->0, 1->0, 2->-5, 3->-10
    - New formula: A-Game Score = base_score + caffeine_penalty
    - Maintains backward compatibility by keeping old column
*/

DO $$
BEGIN
  -- Add caffeine intake scale (0-3)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'caffeine_intake'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN caffeine_intake integer CHECK (caffeine_intake BETWEEN 0 AND 3);
  END IF;

  -- Add caffeine penalty field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'caffeine_penalty'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN caffeine_penalty integer CHECK (caffeine_penalty BETWEEN -10 AND 0);
  END IF;
END $$;

-- Add comments explaining the new system
COMMENT ON COLUMN pre_session_protocols.caffeine_intake IS
'Caffeine consumption level: 0 = None, 1 = 1 cup, 2 = 2-3 cups, 3 = Heavy (>3 cups/energy drinks)';

COMMENT ON COLUMN pre_session_protocols.caffeine_penalty IS
'Score penalty based on caffeine: 0->0, 1->0, 2->-5, 3->-10';

COMMENT ON COLUMN pre_session_protocols.a_game_score IS
'A-Game Readiness Score (0-100). Formula: ((sleep + energy + clarity + emotions + physical_prep) / 5 * 10) + caffeine_penalty. Physical prep = (water + food + stretch) * 3.33';
