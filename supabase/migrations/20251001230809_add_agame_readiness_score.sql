/*
  # Add A-Game Readiness Score to Pre-Session Protocol

  1. New Columns
    - `sleep_quality_score` (integer 0-10) - Sleep quality assessment
    - `energy_level_readiness` (integer 0-10) - Energy level for readiness
    - `mental_clarity` (integer 0-10) - Focus/concentration level
    - `emotional_stability` (integer 0-10) - Emotional state assessment
    - `physical_prep_water` (boolean) - Hydration check
    - `physical_prep_food` (boolean) - Nutrition check
    - `physical_prep_stretch` (boolean) - Warm-up/stretch check
    - `physical_prep_caffeine` (boolean) - Caffeine intake check
    - `a_game_score` (integer 0-100) - Calculated readiness score
    - `readiness_zone` (text) - GO/CAUTION/STOP indicator
    - `skip_readiness_check` (boolean) - Option to skip the check

  2. Changes
    - Add new columns to pre_session_protocols table
    - All fields nullable to maintain backward compatibility
    - Add check constraints for score ranges

  3. Notes
    - Physical prep score calculated as: (water + food + stretch + caffeine) * 2.5
    - A-Game Score = (sleep + energy + clarity + emotions + physical_prep) / 5 * 10
    - Zones: 70-100 = GO, 50-69 = CAUTION, <50 = STOP
*/

-- Add A-Game Readiness Score columns
DO $$
BEGIN
  -- Sleep quality score (0-10)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'sleep_quality_score'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN sleep_quality_score integer CHECK (sleep_quality_score BETWEEN 0 AND 10);
  END IF;

  -- Energy level readiness (0-10)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'energy_level_readiness'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN energy_level_readiness integer CHECK (energy_level_readiness BETWEEN 0 AND 10);
  END IF;

  -- Mental clarity/focus (0-10)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'mental_clarity'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN mental_clarity integer CHECK (mental_clarity BETWEEN 0 AND 10);
  END IF;

  -- Emotional stability (0-10)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'emotional_stability'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN emotional_stability integer CHECK (emotional_stability BETWEEN 0 AND 10);
  END IF;

  -- Physical prep checklist items
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'physical_prep_water'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN physical_prep_water boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'physical_prep_food'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN physical_prep_food boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'physical_prep_stretch'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN physical_prep_stretch boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'physical_prep_caffeine'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN physical_prep_caffeine boolean DEFAULT false;
  END IF;

  -- A-Game Score (0-100)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'a_game_score'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN a_game_score integer CHECK (a_game_score BETWEEN 0 AND 100);
  END IF;

  -- Readiness zone indicator
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'readiness_zone'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN readiness_zone text CHECK (readiness_zone IN ('GO', 'CAUTION', 'STOP'));
  END IF;

  -- Skip readiness check option
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'skip_readiness_check'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN skip_readiness_check boolean DEFAULT false;
  END IF;
END $$;

-- Add comment explaining the scoring system
COMMENT ON COLUMN pre_session_protocols.a_game_score IS
'A-Game Readiness Score (0-100). Formula: (sleep + energy + clarity + emotions + physical_prep) / 5 * 10. Physical prep = (water + food + stretch + caffeine) * 2.5';

COMMENT ON COLUMN pre_session_protocols.readiness_zone IS
'Readiness zone based on score: GO (70-100), CAUTION (50-69), STOP (<50)';
