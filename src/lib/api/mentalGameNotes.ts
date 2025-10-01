import { supabase } from '../supabase';

export interface MentalGameNote {
  id: string;
  session_id: string;
  note_text: string;
  created_at: string;
}

export const createMentalGameNotes = async (sessionId: string, notes: string[]) => {
  if (!notes.length) return [];

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('mental_game_notes')
    .insert(
      notes.map(note => ({
        session_id: sessionId,
        note_text: note,
        user_id: user?.id
      }))
    )
    .select();

  if (error) throw error;
  return data;
};

export const getMentalGameNotes = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('mental_game_notes')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const deleteMentalGameNote = async (noteId: string) => {
  const { error } = await supabase
    .from('mental_game_notes')
    .delete()
    .eq('id', noteId);

  if (error) throw error;
};

export const updateMentalGameNote = async (noteId: string, noteText: string) => {
  const { data, error } = await supabase
    .from('mental_game_notes')
    .update({ note_text: noteText })
    .eq('id', noteId)
    .select()
    .single();

  if (error) throw error;
  return data;
};