import { supabase } from '../supabase';

export interface ProgressMetrics {
  mental_game_score: number;
  focus_rating: number;
  tilt_control_score: number;
  session_count: number;
  total_minutes: number;
  a_game_percentage: number;
  date: string;
}

export interface ProgressGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  target_value: number;
  current_value: number;
  deadline: string;
  completed: boolean;
  tasks: Array<{
    title: string;
    completed: boolean;
  }>;
}

export const getProgressMetrics = async (timeRange: 'week' | 'month' | 'year' = 'month') => {
  const { data: metrics, error } = await supabase
    .from('progress_metrics')
    .select('*')
    .order('date', { ascending: true });

  if (error) throw error;
  return metrics;
};

export const getProgressGoals = async () => {
  const { data: goals, error } = await supabase
    .from('progress_goals')
    .select('*')
    .order('deadline', { ascending: true });

  if (error) throw error;
  return goals;
};

export const updateGoal = async (goalId: string, updates: Partial<ProgressGoal>) => {
  const { data: goal, error } = await supabase
    .from('progress_goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single();

  if (error) throw error;
  return goal;
};

export const createGoal = async (goal: Omit<ProgressGoal, 'id'>) => {
  const { data: newGoal, error } = await supabase
    .from('progress_goals')
    .insert([{
      ...goal,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) throw error;
  return newGoal;
};