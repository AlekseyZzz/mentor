import { supabase } from '../supabase';

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTagData {
  name: string;
  color: string;
}

export interface UpdateTagData {
  name?: string;
  color?: string;
}

export async function getUserTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('usage_count', { ascending: false })
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function searchTags(query: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('usage_count', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data || [];
}

export async function createTag(tagData: CreateTagData): Promise<Tag> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('tags')
    .insert({
      user_id: user.id,
      name: tagData.name.trim(),
      color: tagData.color
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTag(id: string, tagData: UpdateTagData): Promise<Tag> {
  const { data, error } = await supabase
    .from('tags')
    .update(tagData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTag(id: string): Promise<void> {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function incrementTagUsage(tagName: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: tag } = await supabase
    .from('tags')
    .select('id, usage_count')
    .eq('user_id', user.id)
    .eq('name', tagName)
    .maybeSingle();

  if (tag) {
    await supabase
      .from('tags')
      .update({ usage_count: tag.usage_count + 1 })
      .eq('id', tag.id);
  }
}

export async function getOrCreateTag(name: string, color: string = '#3B82F6'): Promise<Tag> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: existingTag } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', user.id)
    .eq('name', name.trim())
    .maybeSingle();

  if (existingTag) {
    return existingTag;
  }

  return createTag({ name, color });
}
