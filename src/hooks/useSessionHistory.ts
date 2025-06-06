import { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { supabase } from '../lib/supabase';

export const useSessionHistory = (currentMonth: Date) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const start = startOfMonth(currentMonth).toISOString();
        const end = endOfMonth(currentMonth).toISOString();

        // Fetch sessions with all related data
        const { data, error: fetchError } = await supabase
          .from('post_session_reflections')
          .select(`
            *,
            mental_game_notes (
              id,
              note_text,
              created_at
            ),
            hand_analysis (
              id,
              screenshot_url,
              hand_description,
              initial_thought,
              adaptive_thought,
              spot_type,
              position_dynamic,
              tags,
              priority_level,
              theory_attachments
            )
          `)
          .gte('created_at', start)
          .lte('created_at', end)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Transform data for easier consumption
        const transformedData = data?.map(session => ({
          ...session,
          mental_game_notes: session.mental_game_notes || [],
          hand_analysis: (session.hand_analysis || []).map((hand: any) => ({
            ...hand,
            theory_attachments: hand.theory_attachments || []
          }))
        }));

        setSessions(transformedData || []);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch sessions'));
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [currentMonth]);

  return { sessions, loading, error };
};