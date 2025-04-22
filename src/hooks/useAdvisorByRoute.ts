import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Advisor } from '../types';

export function useAdvisorByRoute(route: string) {
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdvisor() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('advisors')
          .select(`
            id,
            name,
            title,
            profile_image,
            bio,
            tags,
            route,
            gpt_link,
            responsibilities,
            key_decisions,
            value_to_org
          `)
          .eq('route', route)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Advisor not found');
        
        setAdvisor(data);
      } catch (err) {
        console.error('Error fetching advisor:', err);
        setError('Failed to load advisor details');
        setAdvisor(null);
      } finally {
        setLoading(false);
      }
    }

    if (route) {
      fetchAdvisor();
    }
  }, [route]);

  return { advisor, loading, error };
}