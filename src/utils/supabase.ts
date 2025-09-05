import { supabase } from '@/integrations/supabase/client';
import { Assistant, FAQ, ChatSession } from '@/types/index';

export const fetchAssistants = async (userId: string): Promise<Assistant[]> => {
  const { data, error } = await supabase
    .from('assistants')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchFAQs = async (assistantId: string): Promise<FAQ[]> => {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('assistant_id', assistantId)
    .eq('is_visible', true);

  if (error) throw error;
  return data || [];
};

export const fetchChatSessions = async (): Promise<ChatSession[]> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*, assistants (name)')
    .eq('is_test_session', true)
    .order('last_activity', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data || [];
};