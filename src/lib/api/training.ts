import { supabase } from '../supabase';

export interface TrainingLesson {
  id: string;
  title: string;
  description: string;
  content_type: 'text' | 'reflection' | 'interactive' | 'review';
  content_body: string;
  week_number: number;
  day_number: number;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_minutes: number;
}

export interface UserProgress {
  lesson_id: string;
  completed_at: string | null;
  understanding_rating: number | null;
  reflection_notes: string | null;
  next_review_date: string | null;
}

export const getTodayLesson = async () => {
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('current_week, current_day, last_training_date')
    .single();

  if (!userProfile) throw new Error('User profile not found');

  const { data: lessons } = await supabase
    .from('training_lessons')
    .select('*')
    .eq('week_number', userProfile.current_week)
    .eq('day_number', userProfile.current_day);

  // Return null if no lesson is found
  return lessons && lessons.length > 0 ? lessons[0] : null;
};

export const getTrainingStats = async (userId: string) => {
  // Get user profile data
  const { data: profileData } = await supabase
    .from('user_profiles')
    .select('training_streak, current_week, current_day')
    .eq('id', userId)
    .single();

  // Get completed lessons count in a separate query
  const { count: completedLessons } = await supabase
    .from('user_training_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .not('completed_at', 'is', null);

  return {
    training_streak: profileData?.training_streak || 0,
    current_week: profileData?.current_week || 1,
    current_day: profileData?.current_day || 1,
    completed_lessons: completedLessons || 0
  };
};

export const getDueReviews = async () => {
  const { data: reviews } = await supabase
    .from('user_training_progress')
    .select(`
      lesson_id,
      training_lessons (*)
    `)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    .lte('next_review_date', new Date().toISOString())
    .not('completed_at', 'is', null)
    .order('next_review_date', { ascending: true });

  return reviews || [];
};

export const completeLesson = async (
  lessonId: string,
  rating: number,
  notes: string
) => {
  const now = new Date().toISOString();
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + 3); // Initial review in 3 days

  const { data: progress, error } = await supabase
    .from('user_training_progress')
    .upsert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      lesson_id: lessonId,
      completed_at: now,
      understanding_rating: rating,
      reflection_notes: notes,
      next_review_date: nextReview.toISOString(),
      review_interval: 3
    })
    .select()
    .single();

  if (error) throw error;

  // Update user profile
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({
      current_day: supabase.sql`LEAST(current_day + 1, 7)`,
      last_training_date: now,
      training_streak: supabase.sql`
        CASE 
          WHEN last_training_date = CURRENT_DATE - 1 
          THEN training_streak + 1 
          ELSE 1 
        END
      `
    })
    .eq('id', (await supabase.auth.getUser()).data.user?.id);

  if (updateError) throw updateError;

  return progress;
};