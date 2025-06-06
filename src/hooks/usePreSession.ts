import { useState } from 'react';
import { PreSessionProtocol, submitPreSessionProtocol, getLatestPreSessionProtocol } from '../lib/api/preSession';

export const usePreSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (data: PreSessionProtocol) => {
    try {
      setLoading(true);
      setError(null);
      const protocol = await submitPreSessionProtocol(data);
      return protocol;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to submit pre-session protocol'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLatest = async () => {
    try {
      setLoading(true);
      setError(null);
      const protocol = await getLatestPreSessionProtocol();
      return protocol;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch latest pre-session protocol'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submit,
    getLatest,
    loading,
    error
  };
};