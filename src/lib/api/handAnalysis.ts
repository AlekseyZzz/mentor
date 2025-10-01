import { supabase } from '../supabase';

export interface HandAnalysis {
  id: string;
  session_id: string;
  screenshot_url?: string;
  hand_description: string;
  initial_thought: string;
  adaptive_thought: string;
  arguments_for_initial?: string;
  arguments_against_initial?: string;
  spot_type?: string;
  position_dynamic?: string;
  tags: string[];
  priority_level?: 'high' | 'medium' | 'low';
  theory_attachments: Array<{
    image_url: string;
    caption: string;
  }>;
}

export const createHandAnalysis = async (sessionId: string, hands: Omit<HandAnalysis, 'id' | 'session_id'>[]) => {
  if (!hands.length) return [];

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('hand_analysis')
    .insert(
      hands.map(hand => ({
        ...hand,
        session_id: sessionId,
        user_id: user?.id
      }))
    )
    .select();

  if (error) throw error;
  return data;
};

export const getSessionHandAnalysis = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('hand_analysis')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const updateHandAnalysis = async (handId: string, hand: any) => {
  const { data, error } = await supabase
    .from('hand_analysis')
    .update({
      screenshot_url: hand.screenshotUrl,
      hand_description: hand.description,
      initial_thought: hand.initialThought,
      adaptive_thought: hand.adaptiveThought,
      arguments_for_initial: hand.argumentsFor,
      arguments_against_initial: hand.argumentsAgainst,
      spot_type: hand.spotType,
      position_dynamic: hand.positionDynamic,
      tags: hand.tags,
      priority_level: hand.priorityLevel,
      theory_attachments: hand.theoryAttachments
    })
    .eq('id', handId)
    .select()
    .single();

  if (error) throw error;
  return data;
};