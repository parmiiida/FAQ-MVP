'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Send,
  Bot,
  User,
  Download,
  RefreshCcw,
  MessageCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

type Assistant = {
  id: string;
  name: string;
  description: string | null;
  tone: string | null;
  personality: string | null;
};

type FAQ = {
  id: string;
  question: string;
  answer: string;
  assistant_id: string;
  is_visible: boolean | null;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type ChatSession = {
  id: string;
  assistant_id: string | null;
  last_activity: string;
  is_test_session: boolean | null;
  started_at: string;
  user_id: string | null;
  assistants: { name: string } | null;
};

const ChatInterface = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    fetchAssistants();
    fetchChatSessions();

    const assistantId = searchParams.get('assistant');
    if (assistantId) {
      // Will be set when assistants are loaded
    }
  }, []);

  useEffect(() => {
    if (assistants.length > 0) {
      const assistantId = searchParams.get('assistant');
      if (assistantId) {
        const assistant = assistants.find(a => a.id === assistantId);
        if (assistant) {
          handleAssistantChange(assistant);
        }
      } else if (assistants.length > 0) {
        handleAssistantChange(assistants[0]);
      }
    }
  }, [assistants]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchAssistants = async () => {
    if (!user?.id) return;
    const userId = user.id;
    try {
      const { data, error } = await supabase
        .from('assistants')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssistants(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch assistants",
        variant: "destructive"
      });
    }
  };

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

    // Reset chat
    setMessages([
      {
        role: 'assistant',
        content: `Hello! I'm ${assistant.name}. How can I help you today?`,
        timestamp: new Date()
      }
    ]);

    // Create new test session
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          assistant_id: assistant.id,
          user_id: user?.id,
          session_data: [],
          is_test_session: true
        })
        .select()
        .single();

      if (error) throw error;
    } catch (error) {
      console.error('Failed to create chat session:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedAssistant || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: inputMessage,
          assistantId: selectedAssistant.id,
          faqs: faqs,
          context: {
            tone: selectedAssistant.tone,
            personality: selectedAssistant.personality
          }
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Log analytics
      await supabase
        .from('analytics')
        .insert({
          assistant_id: selectedAssistant.id,
          user_id: user?.id,
          event_type: 'chat_message',
          event_data: {
            user_message: inputMessage,
            ai_response: data.response,
            session_type: 'test'
          }
        });

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive"
      });

      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const exportChat = () => {
    const chatText = messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${selectedAssistant?.name}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Success", description: "Chat exported successfully" });
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Hello! I'm ${selectedAssistant?.name}. How can I help you today?`,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Sidebar */}
      <div className="w-80 space-y-4">
        {/* Assistant Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Select Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            {assistants.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">No active assistants</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard/assistants')}
                >
                  Create Assistant
                </Button>
              </div>
            ) : (
              <Select
                value={selectedAssistant?.id || ''}
                onValueChange={(value) => {
                  const assistant = assistants.find(a => a.id === value);
                  if (assistant) handleAssistantChange(assistant);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an assistant" />
                </SelectTrigger>
                <SelectContent>
                  {assistants.map((assistant) => (
                    <SelectItem key={assistant.id} value={assistant.id}>
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        {assistant.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {/* Assistant Info */}
        {selectedAssistant && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-5 h-5" />
                {selectedAssistant.name}
              </CardTitle>
              <CardDescription>
                {selectedAssistant.description || 'No description'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedAssistant.tone}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {faqs.length} FAQs
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearChat}>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Clear Chat
                </Button>
                <Button variant="outline" size="sm" onClick={exportChat}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Sessions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              {chatSessions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent sessions
                </p>
              ) : (
                <div className="space-y-2">
                  {chatSessions.map((session) => (
                    <div key={session.id} className="p-2 rounded border text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{session.assistants?.name}</span>
                        <Clock className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        {new Date(session.last_activity).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {selectedAssistant ? `Chat with ${selectedAssistant.name}` : 'Select an Assistant'}
            </CardTitle>
            {selectedAssistant && (
              <Badge variant="default">Test Mode</Badge>
            )}
          </div>
        </CardHeader>

        {selectedAssistant ? (
          <>
            {/* Messages */}
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] p-3 rounded-lg",
                          message.role === 'user'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Assistant Selected</h3>
              <p className="text-muted-foreground mb-4">
                Choose an assistant from the sidebar to start chatting
              </p>
              <Button onClick={() => router.push('/dashboard/assistants')}>
                Create Assistant
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatInterface;