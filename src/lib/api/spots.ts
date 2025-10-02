import { supabase } from '../supabase';

export interface Spot {
  id: string;
  user_id: string;
  name: string;
  use_count: number;
  created_at: string;
  updated_at: string;
}

export const getAllSpots = async (): Promise<Spot[]> => {
  const { data, error } = await supabase
    .from('spots_positions')
    .select('*')
    .order('use_count', { ascending: false })
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const createSpot = async (name: string): Promise<Spot> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: existing, error: checkError } = await supabase
    .from('spots_positions')
    .select('*')
    .eq('name', name)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existing) {
    const { data, error } = await supabase
      .from('spots_positions')
      .update({ use_count: existing.use_count + 1 })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('spots_positions')
    .insert([{ user_id: user.id, name, use_count: 1 }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const incrementSpotUsage = async (name: string): Promise<void> => {
  const { data: existing, error: checkError } = await supabase
    .from('spots_positions')
    .select('*')
    .eq('name', name)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existing) {
    const { error } = await supabase
      .from('spots_positions')
      .update({ use_count: existing.use_count + 1 })
      .eq('id', existing.id);

    if (error) throw error;
  }
};
