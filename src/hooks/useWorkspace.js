import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export function useWorkspace() {
  const [isSaving, setIsSaving] = useState(false);

  const saveWorkspace = async (userId, title, moduleType, payload) => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('saved_workspaces')
        .insert([
          { 
            user_id: userId, 
            title: title, 
            module: moduleType, 
            payload: payload 
          }
        ]);

      if (error) throw error;
      return data;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveWorkspace, isSaving };
}
