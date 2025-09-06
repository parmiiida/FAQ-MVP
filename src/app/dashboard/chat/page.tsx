'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAssistants } from '@/hooks/services/useAssistants';
import { Assistant, FAQ, ChatSession, ChatMessage } from '@/types/index';
import ChatArea from '@/components/ChatArea';
import Sidebar from '@/components/ChatSidebar';

const ChatInterface = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { assistants, fetchAssistants } = useAssistants(user?.id);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  useEffect(() => {
    fetchChatSessions();

    const assistantId = searchParams.get('assistant');
    if (assistantId && assistants.length > 0) {
      const assistant = assistants.find((a: Assistant) => a.id === assistantId);
      if (assistant) {
        handleAssistantChange(assistant);
      }
    } else if (assistants.length > 0 && !selectedAssistant) {
      handleAssistantChange(assistants[0]);
    }
  }, [assistants]);

  const fetchChatSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          assistants (name)
        `)
        .eq('is_test_session', true)
        .order('last_activity', { ascending: false })
        .limit(10);

      if (error) throw error;
      setChatSessions(data || []);
    } catch (error) {
      console.error('Failed to fetch chat sessions:', error);
    }
  };

  const fetchFAQs = async (assistantId: string) => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('assistant_id', assistantId)
        .eq('is_visible', true);

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    }
  };

  const handleAssistantChange = async (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    await fetchFAQs(assistant.id);

    // Create new test session
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          assistant_id: assistant.id,
          user_id: user?.id,
          session_data: [],
          is_test_session: true,
        })
        .select()
        .single();

      if (error) throw error;
    } catch (error) {
      console.error('Failed to create chat session:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      <Sidebar
        assistants={assistants}
        selectedAssistant={selectedAssistant}
        chatSessions={chatSessions}
        faqs={faqs}
        messages={messages}
        setMessages={setMessages}
        onAssistantChange={handleAssistantChange}
      />
      <ChatArea
        selectedAssistant={selectedAssistant}
        userId={user?.id}
        onExportChat={() => {}}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
};

export default ChatInterface;