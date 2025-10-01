/*
  # Refactor Pre-Session Protocol

  1. Changes
    - Add new guardrails fields (stop_loss_bi, stop_win_bi, max_minutes)
    - Add block/break fields (block_play_min, block_break_min)
    - Add focus experiment fields (focus_theme, focus_kpi, collect_screenshots)
    - Add anchor phrases and tilt management arrays
    - Add last session feedback (last_session_quality, weekly_goal_ok)
    - Add override fields for STOP zone
    - Rename and restructure existing readiness fields
    - Add computed physiology score field

  2. New Columns
    - tables_max (integer) - Maximum number of tables
    - max_minutes (integer) - Hard stop time limit
    - block_play_min (integer) - Minutes to play per block
    - block_break_min (integer) - Minutes to break per block
    - stop_loss_bi (integer) - Stop loss in buy-ins
    - stop_win_bi (integer) - Stop win in buy-ins (0 = off)
    - focus_theme (text) - Session focus experiment theme
    - focus_kpi (text) - KPI for focus experiment
    - collect_screenshots (boolean) - Flag to collect hand screenshots
    - anchor_phrases (text[]) - Up to 2 mental anchors
    - tilt_triggers (text[]) - Up to 2 early tilt triggers
    - reset_script (text) - Tilt reset procedure
    - last_session_quality (text) - A/B/C rating
    - weekly_goal_ok (boolean) - Weekly goal check-in
    - weekly_goal_text (text) - Updated weekly goal if changed
    - override_stop (boolean) - Override STOP zone recommendation
    - override_reason (text) - Reason for override
    - phys_score (numeric) - Calculated physiology score (0-10)

  3. Notes
    - Maintains backward compatibility with nullable fields
    - All new fields have appropriate constraints
    - Arrays limited to 2 elements via application logic
*/

DO $$
BEGIN
  -- Session basics
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'tables_max'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN tables_max integer CHECK (tables_max BETWEEN 1 AND 12);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'max_minutes'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN max_minutes integer CHECK (max_minutes > 0);
  END IF;

  -- Block/Break settings
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'block_play_min'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN block_play_min integer DEFAULT 50 CHECK (block_play_min >= 25);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'block_break_min'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN block_break_min integer DEFAULT 10 CHECK (block_break_min >= 5);
  END IF;

  -- Guardrails
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'stop_loss_bi'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN stop_loss_bi integer CHECK (stop_loss_bi BETWEEN 0 AND 10);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'stop_win_bi'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN stop_win_bi integer CHECK (stop_win_bi BETWEEN 0 AND 10);
  END IF;

  -- Focus experiment
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'focus_theme'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN focus_theme text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'focus_kpi'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN focus_kpi text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'collect_screenshots'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN collect_screenshots boolean DEFAULT false;
  END IF;

  -- A-Game activation & tilt management
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'anchor_phrases'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN anchor_phrases text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'tilt_triggers'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN tilt_triggers text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'reset_script'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN reset_script text;
  END IF;

  -- Session feedback
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'last_session_quality'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN last_session_quality text CHECK (last_session_quality IN ('A', 'B', 'C'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'weekly_goal_ok'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN weekly_goal_ok boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'weekly_goal_text'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN weekly_goal_text text;
  END IF;

  -- Override fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'override_stop'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN override_stop boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'override_reason'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN override_reason text;
  END IF;

  -- Physiology score (calculated)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pre_session_protocols' AND column_name = 'phys_score'
  ) THEN
    ALTER TABLE pre_session_protocols ADD COLUMN phys_score numeric CHECK (phys_score BETWEEN 0 AND 10);
  END IF;
END $$;

-- Add comments
COMMENT ON COLUMN pre_session_protocols.tables_max IS 'Maximum number of tables to play';
COMMENT ON COLUMN pre_session_protocols.stop_loss_bi IS 'Stop loss in buy-ins (0-10)';
COMMENT ON COLUMN pre_session_protocols.stop_win_bi IS 'Stop win in buy-ins (0 = off)';
COMMENT ON COLUMN pre_session_protocols.focus_theme IS 'Single focus experiment for the session';
COMMENT ON COLUMN pre_session_protocols.anchor_phrases IS 'Up to 2 mental anchor phrases';
COMMENT ON COLUMN pre_session_protocols.tilt_triggers IS 'Up to 2 early tilt warning signs';
COMMENT ON COLUMN pre_session_protocols.override_stop IS 'True if player overrides STOP zone recommendation';
COMMENT ON COLUMN pre_session_protocols.phys_score IS 'Calculated: (water + meal + warmup + caffeine) * 2.5';
