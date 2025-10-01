import { supabase } from '../supabase';

interface PostSessionData {
  minutes_played: number;
  tables_played: number;
  session_date: string;
  energy_level: string;
  mental_profiles: any[];
  pre_session_done: boolean;
  skip_reason?: string;
  pre_session_feeling?: string;
  had_strong_emotions: boolean;
  emotion: string;
  emotion_trigger: string;
  emotion_thoughts: string;
  valid_reaction: string;
  exaggerated_reaction: string;
  future_response: string;
  reset_checklist: {
    breathingDone: boolean;
    visualizationDone: boolean;
    selfWorthReminder: boolean;
  };
  reset_message: string;
  game_level_self_rating?: string;
  non_a_game_reasons?: string[];
  rescue_attempted?: boolean;
  rescue_strategy?: string;
  c_game_moment_note?: string;
}

export async function submit(data: PostSessionData) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error, data: inserted } = await supabase
    .from('post_session_reflections')
    .insert({
      user_id: user.id,
      minutes_played: data.minutes_played,
      tables_played: data.tables_played,
      session_date: data.session_date,
      energy_level: data.energy_level,
      mental_profiles: data.mental_profiles,
      pre_session_done: data.pre_session_done,
      skip_reason: data.skip_reason,
      pre_session_feeling: data.pre_session_feeling,
      had_strong_emotions: data.had_strong_emotions,
      emotion: data.emotion,
      emotion_trigger: data.emotion_trigger,
      emotion_thoughts: data.emotion_thoughts,
      valid_reaction: data.valid_reaction,
      exaggerated_reaction: data.exaggerated_reaction,
      future_response: data.future_response,
      reset_checklist: data.reset_checklist,
      reset_message: data.reset_message,
      game_level_self_rating: data.game_level_self_rating,
      non_a_game_reasons: data.non_a_game_reasons,
      rescue_attempted: data.rescue_attempted,
      rescue_strategy: data.rescue_strategy,
      c_game_moment_note: data.c_game_moment_note
    })
    .select()
    .single();

  if (error) throw error;
  return inserted;
}
export async function getLatestPostSessionReflection() {
  const { data, error } = await supabase
    .from('post_session_reflections')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}
export async function getPostSessionHistory() {
  const { data, error } = await supabase
    .from('post_session_reflections')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
