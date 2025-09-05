'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';


export default function AssistantCreate() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [personality, setPersonality] = useState('');
  const [tone, setTone] = useState('friendly');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create an assistant",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('assistants')
        .insert({
          name,
          description,
          personality,
          tone,
          is_active: true,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Assistant created!",
        description: `${name} has been created successfully.`,
      });

      router.push('/dashboard/assistants');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assistant",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };


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
            <h1 className="text-3xl font-bold text-foreground">Create AI Assistant</h1>
            <p className="text-muted-foreground mt-2">
              Set up a new AI assistant with custom personality and behavior
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-0 shadow-dashboard-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-primary" />
                  Assistant Details
                </CardTitle>
                <CardDescription>
                  Configure your AI assistant's basic information and behavior
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
                      {isLoading ? 'Creating...' : 'Create Assistant'}
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

          {/* Preview */}
          <div>
            <Card className="bg-gradient-card border-0 shadow-dashboard-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-secondary" />
                  Preview
                </CardTitle>
                <CardDescription>
                  How your assistant will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">
                        {name || 'Assistant Name'}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {description || 'Assistant description will appear here...'}
                      </p>
                    </div>
                  </div>


                  {personality && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Personality:
                      </p>
                      <p className="text-xs text-foreground">
                        {personality}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}