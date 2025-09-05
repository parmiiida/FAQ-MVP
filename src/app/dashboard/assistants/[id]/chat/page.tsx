"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, ArrowLeft, Download, History, Code, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, use, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  assistant_id: string;
  user_id: string | null;
};

type Assistant = {
  id: string;
  name: string;
  personality: string | null;
  tone: string | null;
};

const mockMessages: Message[] = [
  {
    id: "1",
    role: "assistant" as const,
    content: "Hello! I'm your Customer Support Bot. How can I help you today?",
    created_at: new Date(Date.now() - 300000).toISOString(),
    assistant_id: "mock",
    user_id: "mock"
  },
  {
    id: "2",
    role: "user" as const,
    content: "How do I reset my password?",
    created_at: new Date(Date.now() - 240000).toISOString(),
    assistant_id: "mock",
    user_id: "mock"
  },
  {
    id: "3",
    role: "assistant" as const,
    content: 'To reset your password, click on the "Forgot Password" link on the login page and follow the instructions sent to your email.',
    created_at: new Date(Date.now() - 180000).toISOString(),
    assistant_id: "mock",
    user_id: "mock"
  },
];

const mockConversationLogs = [
  { id: "1", date: "2024-01-15", messages: 12, duration: "8m 30s", status: "completed" },
  { id: "2", date: "2024-01-14", messages: 6, duration: "3m 15s", status: "completed" },
  { id: "3", date: "2024-01-14", messages: 18, duration: "12m 45s", status: "completed" },
  { id: "4", date: "2024-01-13", messages: 4, duration: "2m 10s", status: "incomplete" },
];

export default function AssistantChatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchAssistant();
      fetchMessages();
    }
  }, [id, user?.id]);

  const fetchAssistant = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('assistants')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setAssistant(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assistant",
        variant: "destructive"
      });
    }
  };

  const fetchMessages = async () => {
    try {
      // For now, use mock messages since chat_logs stores JSON
      // In a real implementation, you'd parse the JSON messages from chat_logs
      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    const userMessage = message;
    setMessage("");

    if (!user?.id) return;

    try {
      // Create new message objects for UI
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        created_at: new Date().toISOString(),
        assistant_id: id,
        user_id: user.id
      };

      setMessages((prev) => [...prev, userMsg]);

      // Get FAQs for context
      const { data: faqs } = await supabase
        .from('faqs')
        .select('*')
        .eq('assistant_id', id)
        .eq('is_visible', true);

      // Call AI function
      const response = await fetch('/api/supabase/functions/chat-with-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          assistantId: id,
          faqs: faqs || [],
          context: {
            personality: assistant?.personality,
            tone: assistant?.tone
          }
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const { response: aiResponse } = await response.json();

      // Create AI response message for UI
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        created_at: new Date().toISOString(),
        assistant_id: id,
        user_id: user.id
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Log analytics
      await supabase
        .from('analytics')
        .insert({
          user_id: user.id,
          assistant_id: id,
          event_type: 'chat_message',
          event_data: { message_count: messages.length + 2 }
        });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      setMessage(userMessage); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const exportChatLogs = () => {
    const chatData = {
      assistant: assistant?.name || "Assistant",
      date: new Date().toISOString(),
      messages: messages,
    };

    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat-log-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-8">Loading chat...</div>;
  }

  return (
    <div>
      <div className="px-4 lg:px-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/assistants")}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assistants
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Test Chat</h1>
            <p className="text-muted-foreground">{assistant?.name || `Assistant ID: ${id}`}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[600px] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <TabsList>
              <TabsTrigger value="chat" className="flex items-center">
                <Bot className="w-4 h-4 mr-2" />
                Live Chat
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center">
                <History className="w-4 h-4 mr-2" />
                Conversation Logs
              </TabsTrigger>
              <TabsTrigger value="embed" className="flex items-center">
                <Code className="w-4 h-4 mr-2" />
                Embed & API
              </TabsTrigger>
            </TabsList>
            <Button onClick={exportChatLogs} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col m-0">
            <Card className="bg-gradient-card border-0 shadow-dashboard-md flex-1 flex flex-col">
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Start a conversation with your assistant</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`flex items-start space-x-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-primary" : "bg-gradient-primary"}`}>
                              {msg.role === "user" ? (
                                <User className="w-4 h-4 text-white" />
                              ) : (
                                <Bot className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className={`rounded-lg p-3 ${msg.role === "user" ? "bg-primary text-white" : "bg-muted"}`}>
                              <p className="text-sm">{msg.content}</p>
                              <p className="text-xs opacity-70 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={sending || !message.trim()}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="flex-1 m-0">
            <Card className="bg-gradient-card border-0 shadow-dashboard-md h-full">
              <CardHeader>
                <CardTitle>Conversation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockConversationLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{log.date}</p>
                        <p className="text-sm text-muted-foreground">{log.messages} messages • {log.duration}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${log.status === "completed" ? "bg-green-500/20 text-green-700" : "bg-yellow-500/20 text-yellow-700"}`}>
                          {log.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="embed" className="flex-1 m-0">
            <div className="grid gap-6 h-full">
              <Card className="bg-gradient-card border-0 shadow-dashboard-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Website Embed Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Embed Snippet</label>
                      <div className="bg-muted p-4 rounded-lg text-sm font-mono">
                        <code>{`<script src="https://ai-dashboard.com/embed.js"></script>
<div id="ai-assistant" data-assistant-id="${id}"></div>`}</code>
                      </div>
                      <Button className="mt-2" variant="outline" size="sm">
                        Copy Code
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Primary Color</label>
                        <input type="color" className="w-full h-10 rounded border" defaultValue="#6366f1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Position</label>
                        <select className="w-full h-10 rounded border bg-background px-3">
                          <option>Bottom Right</option>
                          <option>Bottom Left</option>
                          <option>Top Right</option>
                          <option>Top Left</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-dashboard-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    API Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">API Endpoint</label>
                      <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                        https://api.ai-dashboard.com/v1/assistants/{id}/chat
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">API Key</label>
                      <div className="flex space-x-2">
                        <Input value="sk-••••••••••••••••••••••••••••••••" readOnly />
                        <Button variant="outline">Regenerate</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View API Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


