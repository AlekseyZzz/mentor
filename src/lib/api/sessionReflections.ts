import { supabase } from '../supabase';

export interface SessionReflection {
  mindset: string;
  energy_level: number;
  focus_rating: number;
  notes: string;
  game_level_self_rating?: string;
  non_a_game_reasons?: string[];
  rescue_attempted?: boolean;
  rescue_strategy?: string;
  c_game_moment_note?: string;
}

export const submitSessionReflection = async (data: SessionReflection) => {
  const { data: reflection, error } = await supabase
    .from('session_reflections')
    .insert([{
      ...data,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) throw error;
  return reflection;
};

export const getSessionReflections = async (limit = 10) => {
  const { data: reflections, error } = await supabase
    .from('session_reflections')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return reflections;
};