import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardMetrics, getDashboardMetrics } from '../lib/api/dashboard';

export const useDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, loading: authLoading } = useAuth();

  const fetchMetrics = async () => {
    if (!user?.id) {
      setMetrics(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getDashboardMetrics(user.id);
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard metrics'));
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchMetrics();
    }
  }, [user?.id, authLoading]);

  return {
    metrics,
    loading: loading || authLoading,
    error,
    refresh: fetchMetrics
  };
};