import { supabase } from '../supabase';

export interface DashboardMetrics {
  totalSessions: number;
  averageGameQuality: number;
  mentalStateScores: {
    aGame: number;
    bGame: number;
    cGame: number;
    dGame: number;
  };
  focusAreas: {
    title: string;
    progress: number;
    category: string;
  }[];
  recentSessions: {
    date: string;
    duration: string;
    gameType: string;
    performance: string;
    mentalState: string;
    profit?: number;
  }[];
}

export const getDashboardMetrics = async (userId: string): Promise<DashboardMetrics> => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  // Get recent post-session reflections
  const { data: reflections } = await supabase
    .from('post_session_reflections')
    .select(`
      created_at,
      minutes_played,
      energy_level,
      mental_profiles,
      dominant_profile
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  // Get mental game scores - removed .single()
  const { data: mentalScores } = await supabase
    .from('mental_game_scores')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(1);

  // Transform data for dashboard - safely access first score if it exists
  const metrics: DashboardMetrics = {
    totalSessions: reflections?.length || 0,
    averageGameQuality: calculateAverageGameQuality(reflections || []),
    mentalStateScores: {
      aGame: mentalScores?.[0]?.a_game_score || 0,
      bGame: mentalScores?.[0]?.b_game_score || 0,
      cGame: mentalScores?.[0]?.c_game_score || 0,
      dGame: mentalScores?.[0]?.d_game_score || 0,
    },
    focusAreas: [
      {
        title: "Mental Game Consistency",
        progress: calculateMentalGameProgress(reflections || []),
        category: "Mental Game"
      },
      {
        title: "Tilt Control",
        progress: calculateTiltProgress(reflections || []),
        category: "Mental Game"
      },
      {
        title: "Focus Duration",
        progress: calculateFocusProgress(reflections || []),
        category: "Physical Game"
      }
    ],
    recentSessions: transformReflectionsToSessions(reflections || [])
  };

  return metrics;
};

function calculateAverageGameQuality(reflections: any[]): number {
  if (!reflections.length) return 0;
  const qualityScores = reflections.map(r => 
    r.mental_profiles.includes('A-Game') ? 100 :
    r.mental_profiles.includes('B-Game') ? 75 :
    r.mental_profiles.includes('C-Game') ? 50 :
    25
  );
  return Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length);
}

function calculateMentalGameProgress(reflections: any[]): number {
  if (!reflections.length) return 0;
  const aGameSessions = reflections.filter(r => 
    r.mental_profiles.includes('A-Game') || 
    r.dominant_profile === 'A-Game'
  ).length;
  return Math.round((aGameSessions / reflections.length) * 100);
}

function calculateTiltProgress(reflections: any[]): number {
  if (!reflections.length) return 0;
  const tiltControlled = reflections.filter(r => 
    !r.mental_profiles.includes('D-Game')
  ).length;
  return Math.round((tiltControlled / reflections.length) * 100);
}

function calculateFocusProgress(reflections: any[]): number {
  if (!reflections.length) return 0;
  const targetDuration = 180; // 3 hours
  const averageDuration = reflections.reduce((acc, r) => 
    acc + r.minutes_played, 0
  ) / reflections.length;
  return Math.min(100, Math.round((averageDuration / targetDuration) * 100));
}

function transformReflectionsToSessions(reflections: any[]) {
  return reflections.map(r => ({
    date: new Date(r.created_at).toLocaleDateString(),
    duration: `${Math.floor(r.minutes_played / 60)}h ${r.minutes_played % 60}m`,
    gameType: "NL Hold'em",
    performance: r.dominant_profile?.charAt(0) || 'B',
    mentalState: r.energy_level,
  }));
}