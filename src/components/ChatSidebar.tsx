'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Download, RefreshCcw, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Assistant, FAQ, ChatSession, ChatMessage } from '@/types/index';

interface SidebarProps {
  assistants: Assistant[];
  selectedAssistant: Assistant | null;
  chatSessions: ChatSession[];
  faqs: FAQ[];
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  onAssistantChange: (assistant: Assistant) => void;
}

const Sidebar = ({
  assistants,
  selectedAssistant,
  chatSessions,
  faqs,
  messages,
  setMessages,
  onAssistantChange,
}: SidebarProps) => {
  const router = useRouter();
  const { toast } = useToast();

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

  return (
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
                if (assistant) onAssistantChange(assistant);
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
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setMessages([
                    {
                      role: 'assistant',
                      content: `Hello! I'm ${selectedAssistant.name}. How can I help you today?`,
                      timestamp: new Date(),
                    },
                  ])
                }
              >
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
  );
};

export default Sidebar;