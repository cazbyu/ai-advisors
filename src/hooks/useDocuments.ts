import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Document } from '../types';

export function useDocuments(advisorId?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        let query = supabase
          .from('0003_document_index')
          .select('*')
          .order('updated_at', { ascending: false });

        if (advisorId) {
          query = query.eq('advisor', advisorId);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data) {
          setDocuments(data as Document[]);
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents');
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [advisorId]);

  return { documents, loading, error };
}