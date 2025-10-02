import { supabase } from '../supabase';

export interface ScreenshotNote {
  id: string;
  hand_note_id: string;
  screenshot_url: string;
  note: string;
  screenshot_type: 'hand' | 'wizard';
  display_order: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateScreenshotNoteData {
  hand_note_id: string;
  screenshot_url: string;
  note: string;
  screenshot_type: 'hand' | 'wizard';
  display_order: number;
}

export async function getScreenshotNotesByHandId(handNoteId: string): Promise<ScreenshotNote[]> {
  const { data, error } = await supabase
    .from('screenshot_notes')
    .select('*')
    .eq('hand_note_id', handNoteId)
    .order('display_order');

  if (error) throw error;
  return data || [];
}

export async function createScreenshotNote(noteData: CreateScreenshotNoteData): Promise<ScreenshotNote> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('screenshot_notes')
    .insert({
      ...noteData,
      user_id: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateScreenshotNote(id: string, note: string): Promise<ScreenshotNote> {
  const { data, error } = await supabase
    .from('screenshot_notes')
    .update({ note, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteScreenshotNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('screenshot_notes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
