import { supabase } from '../supabase';

export interface MentalGameTrait {
  id: string;
  profile_type: 'a' | 'b' | 'c' | 'd';
  trait_text: string;
  created_at: string;
}

export const addMentalGameTrait = async (profileType: 'a' | 'b' | 'c' | 'd', traitText: string) => {
  const { data, error } = await supabase
    .from('mental_game_traits')
    .insert([{
      profile_type: profileType,
      trait_text: traitText,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getMentalGameTraits = async (profileType?: 'a' | 'b' | 'c' | 'd') => {
  let query = supabase
    .from('mental_game_traits')
    .select('*')
    .order('created_at', { ascending: true });

  if (profileType) {
    query = query.eq('profile_type', profileType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const deleteMentalGameTrait = async (traitId: string) => {
  const { error } = await supabase
    .from('mental_game_traits')
    .delete()
    .eq('id', traitId);

  if (error) throw error;
};