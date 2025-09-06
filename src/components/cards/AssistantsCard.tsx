'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AssistantsCardProps {
  assistantsCount: number;
  recentAssistants: { id: string; name: string; created_at: string }[];
}

const AssistantsCard = ({ assistantsCount, recentAssistants }: AssistantsCardProps) => {
  const router = useRouter();

  return (
    <Card className="stat-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Assistants
        </CardTitle>
        <CardDescription>Create and manage your AI assistants</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {assistantsCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No assistants yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Get started by creating your first AI assistant. You can customize its behavior, add knowledge, and start chatting.
            </p>
            <Button onClick={() => router.push('/dashboard/assistants/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Assistant
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Recent Assistants</h3>
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/assistants')}>
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {recentAssistants.map((assistant) => (
                <div
                  key={assistant.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => router.push('/dashboard/assistants')}
                >
                  <div className="flex items-center gap-3">
                    <Bot className="h-4 w-4 text-primary" />
                    <span className="font-medium">{assistant.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(assistant.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
            <Button className="w-full" variant="outline" onClick={() => router.push('/dashboard/assistants/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Assistant
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssistantsCard;