'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, use } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const mockAssistant = {
  id: '1',
  name: 'Customer Support Bot',
  description: 'Handles customer inquiries and provides support across multiple channels',
  personality: 'Friendly and professional, uses simple language, always helpful and patient',
  status: 'active'
};


type Assistant = {
  id: string;
  name: string;
  description: string | null;
  personality: string | null;
  tone: string | null;
};

export default function AssistantEdit({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [personality, setPersonality] = useState('');
  const [tone, setTone] = useState('friendly');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchAssistant();
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

      if (data) {
        setName(data.name || '');
        setDescription(data.description || '');
        setPersonality(data.personality || '');
        setTone(data.tone || 'friendly');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assistant data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('assistants')
        .update({
          name,
          description,
          personality,
          tone,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Assistant updated!",
        description: `${name} has been updated successfully.`,
      });

      router.push('/dashboard/assistants');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update assistant",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };


  if (loading) {
    return <div className="p-8">Loading assistant data...</div>;
  }

  return (
    <div>
      <div className="px-4 lg:px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/assistants')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assistants
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Assistant</h1>
            <p className="text-muted-foreground mt-2">
              Update your assistant's configuration and behavior
            </p>
          </div>
        </div>

        <Card className="bg-gradient-card border-0 shadow-dashboard-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="w-5 h-5 mr-2 text-primary" />
              Assistant Details
            </CardTitle>
            <CardDescription>
              Modify your AI assistant's information and behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Assistant Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Customer Support Bot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this assistant does and how it helps users..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="personality">Personality & Behavior</Label>
                <Textarea
                  id="personality"
                  placeholder="Describe the assistant's personality, tone, and communication style..."
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  e.g., "Friendly and professional, uses simple language, always helpful and patient"
                </p>
              </div>


              <div className="flex gap-3 pt-6">
                <Button
                  type="submit"
                  className="bg-gradient-primary hover:opacity-90 shadow-glow"
                  disabled={isLoading || !name.trim()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/assistants')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}