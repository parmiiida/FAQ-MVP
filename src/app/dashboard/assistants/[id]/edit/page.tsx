'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, ArrowLeft, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, use } from 'react';
import { useToast } from '@/hooks/use-toast';

const mockAssistant = {
  id: '1',
  name: 'Customer Support Bot',
  description: 'Handles customer inquiries and provides support across multiple channels',
  personality: 'Friendly and professional, uses simple language, always helpful and patient',
  tags: ['customer-service', 'support'],
  status: 'active'
};

const predefinedTags = [
  'customer-service', 'support', 'sales', 'products', 'faq', 'general',
  'technical', 'billing', 'onboarding', 'recommendations'
];

export default function AssistantEdit({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [personality, setPersonality] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load assistant data - in real app this would be from API
    setName(mockAssistant.name);
    setDescription(mockAssistant.description);
    setPersonality(mockAssistant.personality);
    setTags(mockAssistant.tags);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Assistant updated!",
      description: `${name} has been updated successfully.`,
    });

    setIsLoading(false);
    router.push('/dashboard/assistants');
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags([...tags, customTag.trim()]);
      setCustomTag('');
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
                <Label htmlFor="personality">Personality & Tone</Label>
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

              {/* Tags */}
              <div className="space-y-3">
                <Label>Tags</Label>
                <p className="text-sm text-muted-foreground">
                  Add tags to categorize and organize your assistant
                </p>

                {/* Selected tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pr-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 ml-1 hover:bg-transparent"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Predefined tags */}
                <div className="flex flex-wrap gap-2">
                  {predefinedTags.filter(tag => !tags.includes(tag)).map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addTag(tag)}
                      className="text-xs"
                    >
                      + {tag}
                    </Button>
                  ))}
                </div>

                {/* Custom tag input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom tag..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomTag}
                    disabled={!customTag.trim()}
                  >
                    Add
                  </Button>
                </div>
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