import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, Assistant } from '@/types/index';

export const useChat = (assistant: Assistant | null, userId: string | undefined) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: assistant ? `Hello! I'm ${assistant.name}. How can I help you today?` : 'Select an assistant to start chatting',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !assistant || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: inputMessage,
          assistantId: assistant.id,
          faqs: [], // Add FAQ fetching logic separately
          context: {
            tone: assistant.tone,
            personality: assistant.personality,
          },
        },
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      await supabase.from('analytics').insert({
        assistant_id: assistant.id,
        user_id: userId,
        event_type: 'chat_message',
        event_data: {
          user_message: inputMessage,
          ai_response: data.response,
          session_type: 'test',
        },
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AI assistant',
        variant: 'destructive',
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, setMessages, inputMessage, setInputMessage, isLoading, handleSendMessage };
};