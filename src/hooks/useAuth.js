import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/** Tracks the current Supabase Auth session (or null if signed out / not configured). */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, ready, isAdmin: !!session };
}
