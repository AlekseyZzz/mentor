import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('[AUTH INIT]', {
          hasSession: !!session,
          userId: session?.user?.id,
          error: sessionError?.message
        });
        
        if (sessionError) throw sessionError;
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('[AUTH INIT ERROR]', err);
        setError(err as AuthError);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AUTH STATE CHANGE]', {
        event,
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });
      
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[AUTH SIGN IN ATTEMPT]', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[AUTH SIGN IN RESULT]', {
        success: !error,
        userId: data.user?.id,
        error: error?.message
      });

      if (error) throw error;
    } catch (err) {
      console.error('[AUTH SIGN IN ERROR]', err);
      setError(err as AuthError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[AUTH SIGN UP ATTEMPT]', { email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login`,
          data: {
            email: email,
          }
        }
      });

      console.log('[AUTH SIGN UP RESPONSE]', {
        success: !error,
        userId: data.user?.id,
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name,
          stack: error.stack
        } : null,
        session: data.session,
        user: data.user
      });

      if (error) throw error;

      // Log successful signup
      console.log('[AUTH SIGN UP SUCCESS]', {
        userId: data.user?.id,
        email: data.user?.email,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('[AUTH SIGN UP ERROR]', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(err as AuthError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[AUTH SIGN OUT ATTEMPT]');
      
      const { error } = await supabase.auth.signOut();

      console.log('[AUTH SIGN OUT RESULT]', {
        success: !error,
        error: error?.message
      });

      if (error) throw error;
    } catch (err) {
      console.error('[AUTH SIGN OUT ERROR]', err);
      setError(err as AuthError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};