import { useState, useEffect } from 'react';
import { MentalGameTrait, getMentalGameTraits } from '../lib/api/mentalGameTraits';

export const useMentalGameTraits = (profileType?: 'a' | 'b' | 'c' | 'd') => {
  const [traits, setTraits] = useState<MentalGameTrait[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTraits = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMentalGameTraits(profileType);
        setTraits(data);
      } catch (err) {
        console.error('Failed to fetch mental game traits:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch mental game traits'));
      } finally {
        setLoading(false);
      }
    };

    fetchTraits();
  }, [profileType]);

  return { traits, loading, error };
};