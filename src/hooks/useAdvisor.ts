import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Advisor } from '../types';

export function useAdvisor(id: string) {
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
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setAdvisor(data);
      } catch (err) {
        console.error('Error fetching advisor:', err);
        setError('Failed to load advisor details');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchAdvisor();
    }
  }, [id]);

  return { advisor, loading, error };
}