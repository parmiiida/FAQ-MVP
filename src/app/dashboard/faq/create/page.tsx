"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import gsap from "gsap";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import {
  Plus,
  Trash2,
  Save,
  Tag,
  Eye,
  EyeOff,
} from "lucide-react";

const CreateEditFAQ = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [assistants, setAssistants] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState([
    "General",
    "Technical",
    "Billing",
    "Getting Started",
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    assistant_id: "",
    question: "",
    answer: "",
    category: "",
    tags: [] as string[],
    sort_order: 0,
    is_visible: true,
  });

  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchAssistants(user.id);
    }
    gsap.fromTo(
      ".faq-form",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, [user?.id]);

  const fetchAssistants = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("assistants")
        .select("id, name")
        .eq("user_id", userId)
        .order("name");

      if (error) throw error;
      setAssistants(data || []);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch assistants",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!formData.assistant_id || !formData.question || !formData.answer) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("faqs").insert({
        ...formData,
        tags: formData.tags,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "FAQ created successfully",
      });

      router.push("/dashboard/faqs");
    } catch {
      toast({
        title: "Error",
        description: "Failed to create FAQ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 faq-form">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/dashboard/faqs")}>
          ← Back to FAQs
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New FAQ</h1>
        <p className="text-muted-foreground mt-2">
          Add a new question and answer to your knowledge base
        </p>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* --- Basic Info --- */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Assistant</CardTitle>
              <CardDescription>
                Choose which AI assistant this FAQ belongs to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.assistant_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, assistant_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an assistant" />
                </SelectTrigger>
                <SelectContent>
                  {assistants.map((assistant) => (
                    <SelectItem key={assistant.id} value={assistant.id}>
                      {assistant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {assistants.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  No assistants found.{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => router.push("/dashboard/assistants")}
                  >
                    Create one first
                  </Button>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Question & Answer */}
          <Card>
            <CardHeader>
              <CardTitle>Question & Answer</CardTitle>
              <CardDescription>
                Enter the question users might ask and provide a helpful answer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  placeholder="What is your question?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Answer *</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  placeholder="Provide a detailed answer..."
                  className="min-h-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Organization --- */}
        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
              <CardDescription>
                Organize your FAQs into categories for better navigation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2 mt-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name"
                />
                <Button onClick={addCategory} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add tags to make your FAQs more searchable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter a tag"
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} variant="outline">
                  <Tag className="w-4 h-4" />
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="pr-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 ml-1"
                        onClick={() => removeTag(tag)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Settings --- */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Control how and when this FAQ is displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="visibility">Visible to Users</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, this FAQ will be visible in search results
                  </p>
                </div>
                <Switch
                  id="visibility"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_visible: checked })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
                <p className="text-sm text-muted-foreground">
                  Lower numbers appear first. Use 0 for default ordering.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how your FAQ will appear to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">
                    {formData.question || "Your question will appear here"}
                  </h4>
                  {formData.is_visible ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {formData.answer || "Your answer will appear here"}
                </p>
                <div className="flex gap-2">
                  {formData.category && (
                    <Badge variant="outline">{formData.category}</Badge>
                  )}
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex gap-2 pt-6 border-t">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Creating..." : "Create FAQ"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/dashboard/faqs")}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CreateEditFAQ;
