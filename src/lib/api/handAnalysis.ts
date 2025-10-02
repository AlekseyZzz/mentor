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
  wizard_drill_script?: string;
}

export const createHandAnalysis = async (sessionId: string, hands: any[]) => {
  if (!hands.length) return [];

  const { data: { user } } = await supabase.auth.getUser();

  const handsToInsert = hands.map(hand => ({
    session_id: sessionId,
    user_id: user?.id,
    screenshot_url: hand.screenshot_url || hand.screenshotUrl,
    hand_description: hand.hand_description || hand.description,
    initial_thought: hand.initial_thought || hand.initialThought,
    adaptive_thought: hand.adaptive_thought || hand.adaptiveThought,
    arguments_for_initial: hand.arguments_for_initial || hand.argumentsFor,
    arguments_against_initial: hand.arguments_against_initial || hand.argumentsAgainst,
    spot_type: hand.spot_type || hand.spotType,
    position_dynamic: hand.position_dynamic || hand.positionDynamic,
    tags: hand.tags || [],
    priority_level: hand.priority_level || hand.priorityLevel,
    theory_attachments: hand.theory_attachments || hand.theoryAttachments || [],
    wizard_drill_script: hand.wizard_drill_script || hand.wizardDrillScript
  }));

  const { data, error } = await supabase
    .from('hand_analysis')
    .insert(handsToInsert)
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
      theory_attachments: hand.theoryAttachments,
      wizard_drill_script: hand.wizardDrillScript
    })
    .eq('id', handId)
    .select()
    .single();

  if (error) throw error;
  return data;
};