import { supabase } from '../supabase';

export interface HandNoteEmotions {
  focus?: number;
  confidence?: number;
  impulsivity?: number;
  tilt_type?: 'Injustice' | 'OwnError' | 'Fatigue' | 'Revenge' | 'Fear' | 'Impatience' | 'Overconfidence' | null;
  game_state?: 'A' | 'B' | 'C' | null;
}

export interface HandNoteFront {
  hand_history: string;
  screenshot_urls: string[];
  thoughts: string;
  arguments_for: string[];
  tags: string[];
}

export interface HandNoteBack {
  wizard_link?: string | null;
  wizard_drill_script?: string | null;
  wizard_screenshots: string[];
  correct_solution: string;
  arguments_against: string[];
  emotions: HandNoteEmotions;
  adaptive_thought: string;
  next_time_plan: string;
}

export interface HandNoteMeta {
  mark_for_review?: boolean;
  review_due_at?: string | null;
  privacy?: 'private' | 'team';
}

export interface HandNote {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  front: HandNoteFront;
  back: HandNoteBack;
  meta: HandNoteMeta;
  deleted_at?: string | null;
}

export interface CreateHandNoteData {
  front: HandNoteFront;
  back: HandNoteBack;
  meta?: HandNoteMeta;
}

export interface UpdateHandNoteData {
  front?: Partial<HandNoteFront>;
  back?: Partial<HandNoteBack>;
  meta?: Partial<HandNoteMeta>;
}

export interface HandNoteFilters {
  query?: string;
  tags?: string[];
  tilt_type?: string;
  from?: string;
  to?: string;
  mark_for_review?: boolean;
}

export const createHandNote = async (data: CreateHandNoteData): Promise<HandNote> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: handNote, error } = await supabase
    .from('hand_notes')
    .insert([{
      user_id: user.id,
      front: data.front,
      back: data.back,
      meta: data.meta || { mark_for_review: false, privacy: 'private' }
    }])
    .select()
    .single();

  if (error) throw error;
  return handNote as HandNote;
};

export const getHandNotes = async (
  filters: HandNoteFilters = {},
  limit: number = 24,
  offset: number = 0
): Promise<{ items: HandNote[]; total: number }> => {
  let query = supabase
    .from('hand_notes')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (filters.tags && filters.tags.length > 0) {
    query = query.contains('front->tags', filters.tags);
  }

  if (filters.tilt_type) {
    query = query.eq('back->emotions->>tilt_type', filters.tilt_type);
  }

  if (filters.from) {
    query = query.gte('created_at', filters.from);
  }

  if (filters.to) {
    query = query.lte('created_at', filters.to);
  }

  if (filters.mark_for_review !== undefined) {
    query = query.eq('meta->>mark_for_review', filters.mark_for_review);
  }

  if (filters.query) {
    query = query.or(`front->>hand_history.ilike.%${filters.query}%,front->>thoughts.ilike.%${filters.query}%,back->>adaptive_thought.ilike.%${filters.query}%`);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    items: (data || []) as HandNote[],
    total: count || 0
  };
};

export const getHandNoteById = async (id: string): Promise<HandNote> => {
  const { data, error } = await supabase
    .from('hand_notes')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) throw error;
  return data as HandNote;
};

export const updateHandNote = async (
  id: string,
  updates: UpdateHandNoteData
): Promise<HandNote> => {
  const updateData: any = {};

  if (updates.front) {
    const { data: current } = await supabase
      .from('hand_notes')
      .select('front')
      .eq('id', id)
      .single();

    updateData.front = { ...current?.front, ...updates.front };
  }

  if (updates.back) {
    const { data: current } = await supabase
      .from('hand_notes')
      .select('back')
      .eq('id', id)
      .single();

    updateData.back = { ...current?.back, ...updates.back };
  }

  if (updates.meta) {
    const { data: current } = await supabase
      .from('hand_notes')
      .select('meta')
      .eq('id', id)
      .single();

    updateData.meta = { ...current?.meta, ...updates.meta };
  }

  const { data, error } = await supabase
    .from('hand_notes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as HandNote;
};

export const deleteHandNote = async (id: string, hard: boolean = false): Promise<void> => {
  if (hard) {
    const { error } = await supabase
      .from('hand_notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
  } else {
    const { data, error } = await supabase
      .from('hand_notes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Soft delete error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Hand note not found or already deleted');
    }
  }
};

export const uploadHandScreenshot = async (
  file: File,
  subfolder: string = 'hands'
): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const timestamp = Date.now();
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${user.id}/${subfolder}/${year}/${month}/${timestamp}-${safeFileName}`;

  const { data, error } = await supabase.storage
    .from('hand-analysis')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('hand-analysis')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const duplicateHandNote = async (id: string): Promise<HandNote> => {
  const original = await getHandNoteById(id);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('hand_notes')
    .insert([{
      user_id: user.id,
      front: original.front,
      back: original.back,
      meta: { ...original.meta, mark_for_review: false }
    }])
    .select()
    .single();

  if (error) throw error;
  return data as HandNote;
};
