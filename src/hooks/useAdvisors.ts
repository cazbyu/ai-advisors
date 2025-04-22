import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Advisor } from '../types';

export function useAdvisors() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdvisors() {
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
          .order('name');

        if (fetchError) throw fetchError;
        
        setAdvisors(data ?? []);
      } catch (err) {
        console.error('Error fetching advisors:', err);
        setAdvisors([]);
        setError('Could not load advisors');
      } finally {
        setLoading(false);
      }
    }

    fetchAdvisors();
  }, []);

  return { advisors, loading, error };
}