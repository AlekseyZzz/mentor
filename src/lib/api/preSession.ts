import { supabase } from '../supabase';

export interface PreSessionProtocol {
  long_term_goal: string;
  goal_meaning: string;
  primary_focus_area: string;
  session_focus: string;
  meditation_duration: number | null;
  mental_state_score: number;
  energy_level_score: number;
  sleep_quality: number;
  emotional_state: string;
  a_game_description: string;
  mental_anchor: string;
  tilt_triggers: string;
  tilt_response: string;
  game_type: string;
  stakes_or_buyin: string;
  planned_duration: string;
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