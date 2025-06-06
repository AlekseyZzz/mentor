import React, { useEffect, useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../contexts/AuthContext';

export default function ProgressTracker() {
  const { user } = useAuth();
  const { fetchMetrics, fetchGoals, loading, error } = useProgress();
  const [metrics, setMetrics] = useState(null);
  const [goals, setGoals] = useState(null);

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          const [metricsData, goalsData] = await Promise.all([
            fetchMetrics(),
            fetchGoals()
          ]);
          setMetrics(metricsData);
          setGoals(goalsData);
        } catch (err) {
          console.error('Failed to load progress data:', err);
        }
      };
      
      loadData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error loading progress data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Progress Tracker</h1>
      
      {/* Debug info */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Auth Status: {user ? '✅ Authenticated' : '❌ Not Authenticated'}
        </p>
        <p className="text-sm text-gray-600">
          Data Status: {metrics ? '✅ Metrics Loaded' : '❌ No Metrics'} | 
          {goals ? '✅ Goals Loaded' : '❌ No Goals'}
        </p>
      </div>

      {/* Main content will be added here */}
      <div className="text-gray-600">
        Progress tracking functionality coming soon...
      </div>
    </div>
  );
}