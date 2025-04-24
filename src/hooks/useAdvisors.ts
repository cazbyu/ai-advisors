import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Advisor } from '../types';

export function useAdvisors() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdvisors() {
      try {
        const { data, error } = await supabase
          .from('advisors')
          .select('*')
          .order('name');

        if (error) throw error;

        if (data) {
          const mappedAdvisors = data.map(advisor => ({
            ...advisor,
            profileImage: advisor.profile_image || advisor.profileImage,
          }));
          setAdvisors(mappedAdvisors);
        }
      } catch (err) {
        console.error('Error fetching advisors:', err);
        setError('Failed to load advisors');
      } finally {
        setLoading(false);
      }
    }

    fetchAdvisors();
  }, []);

  return { advisors, loading, error };
}