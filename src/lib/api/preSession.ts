import { supabase } from '../supabase';

export interface PreSessionProtocol {
  game_type: string;
  stakes_or_buyin: string;
  tables_max: number;
  planned_duration: string;
  max_minutes?: number;
  block_play_min: number;
  block_break_min: number;

  sleep_quality_score: number;
  energy_level_readiness: number;
  mental_clarity: number;
  emotional_stability: number;
  physical_prep_water: boolean;
  physical_prep_food: boolean;
  physical_prep_stretch: boolean;
  physical_prep_caffeine: boolean;
  phys_score: number;
  a_game_score: number | null;
  readiness_zone: string | null;
  skip_readiness_check: boolean;

  stop_loss_bi: number;
  stop_win_bi: number;

  focus_theme: string;
  focus_kpi: string;
  collect_screenshots: boolean;

  anchor_phrases: string[];
  tilt_triggers: string[];
  reset_script: string;

  last_session_quality?: string;
  weekly_goal_ok: boolean;
  weekly_goal_text?: string;

  override_stop: boolean;
  override_reason?: string;

  long_term_goal?: string;
  goal_meaning?: string;
  primary_focus_area?: string;
  session_focus?: string;
  meditation_duration?: number | null;
  mental_state_score?: number;
  energy_level_score?: number;
  sleep_quality?: number;
  emotional_state?: string;
  a_game_description?: string;
  mental_anchor?: string;
  tilt_triggers_old?: string;
  tilt_response?: string;
}

export const submitPreSessionProtocol = async (data: PreSessionProtocol) => {
  const { data: protocol, error } = await supabase
    .from('pre_session_protocols')
    .insert([{
      ...data,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) throw error;
  return protocol;
};

export const getLatestPreSessionProtocol = async () => {
  const { data: protocol, error } = await supabase
    .from('pre_session_protocols')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
  return protocol;
};