import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { TeamMember } from '../types';

export function useTeamMembers(advisorId: string) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('advisors')
          .select('responsibilities, key_decisions, value_to_org')
          .eq('id', advisorId)
          .single();

        if (fetchError) throw fetchError;
        
        // Transform the data into team members format
        const transformedTeamMembers: TeamMember[] = [];
        
        if (data?.responsibilities) {
          Object.entries(data.responsibilities).forEach(([id, role]) => {
            if (typeof role === 'object' && role !== null) {
              transformedTeamMembers.push({
                id: `${advisorId}-${id}`,
                name: role.name || 'Team Member',
                role: role.title || 'Team Role',
                profile_image: role.image || '',
                description: role.description || '',
                expertise: role.skills || []
              });
            }
          });
        }

        setTeamMembers(transformedTeamMembers);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to load team members');
      } finally {
        setLoading(false);
      }
    }

    if (advisorId) {
      fetchTeamMembers();
    }
  }, [advisorId]);

  return { teamMembers, loading, error };
}