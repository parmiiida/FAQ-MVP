'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface KnowledgeBaseCardProps {
  faqsCount: number;
  assistantsCount: number;
}

const KnowledgeBaseCard = ({ faqsCount, assistantsCount }: KnowledgeBaseCardProps) => {
  const router = useRouter();

  return (
    <Card className="stat-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Knowledge Base
        </CardTitle>
        <CardDescription>Manage FAQs and knowledge base entries</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {faqsCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No FAQs yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Build your knowledge base by adding frequently asked questions and their answers.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/dashboard/faq/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard/faq')}>
                Manage FAQs
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Knowledge Base</h3>
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/faq')}>
                Manage
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg text-center">
                <div className="text-lg font-semibold">{faqsCount}</div>
                <div className="text-xs text-muted-foreground">Total FAQs</div>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <div className="text-lg font-semibold">{assistantsCount}</div>
                <div className="text-xs text-muted-foreground">Assistants</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" variant="outline" onClick={() => router.push('/dashboard/faqs/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => router.push('/dashboard/chat')}>
                Test Chat
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseCard;