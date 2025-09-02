"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Upload, X, Loader2 } from "lucide-react";
import { gsap } from "gsap";
import { useAuth } from "@/contexts/AuthContext";
import { FAQService } from "@/lib/faq-service";
import { useToast } from "@/hooks/use-toast";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface KnowledgeBaseSidebarProps {
  onClose?: () => void;
}

export const KnowledgeBaseSidebar: React.FC<KnowledgeBaseSidebarProps> = ({
  onClose,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingFAQId, setEditingFAQId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState("");
  const [editingAnswer, setEditingAnswer] = useState("");

  const sidebarRef = useRef<HTMLDivElement>(null);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

  const startEditingFAQ = (faq: FAQItem) => {
    setEditingFAQId(faq.id);
    setEditingQuestion(faq.question);
    setEditingAnswer(faq.answer);
  };

  const handleSaveFAQ = async (id: string) => {
    if (!editingQuestion.trim() || !editingAnswer.trim()) return;

    try {
      const updatedFAQ = await FAQService.updateFAQ(id, {
        question: editingQuestion,
        answer: editingAnswer,
      });

      setFaqs((prev) => prev.map((faq) => (faq.id === id ? updatedFAQ : faq)));

      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });

      setEditingFAQId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update FAQ",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.set(sidebarRef.current.children, { opacity: 0, y: 20 });
      gsap.to(sidebarRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadFAQs();
    }
  }, [user]);

  const loadFAQs = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await FAQService.getFAQs(user.id);
      setFaqs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load FAQs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFAQ = async () => {
    if (!newQuestion.trim() || !newAnswer.trim() || !user) return;

    setIsAdding(true);
    try {
      const newFAQ = await FAQService.addFAQ({
        question: newQuestion,
        answer: newAnswer,
        user_id: user.id,
      });

      setFaqs((prev) => [newFAQ, ...prev]);
      setNewQuestion("");
      setNewAnswer("");
      setShowAddForm(false);

      toast({
        title: "Success",
        description: "FAQ added successfully",
      });

      // Animate new FAQ
      setTimeout(() => {
        const element = faqRefs.current[0];
        if (element) {
          gsap.set(element, { opacity: 0, scale: 0.8 });
          gsap.to(element, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.7)",
          });
        }
      }, 100);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add FAQ",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    try {
      await FAQService.deleteFAQ(id);
      setFaqs((prev) => prev.filter((faq) => faq.id !== id));
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Placeholder for file processing
    console.log("File uploaded:", file.name);
    // In a real app, you would process CSV/TXT files here
  };

  return (
    <div ref={sidebarRef} className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Knowledge Base</h3>
          <p className="text-sm text-muted-foreground">Manage your FAQs</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden block">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add FAQ
          </Button>

          <div className="relative">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add FAQ Form */}
      {showAddForm && (
        <div className="p-4 border-b bg-muted/50">
          <div className="space-y-3">
            <Input
              placeholder="Question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <textarea
              placeholder="Answer..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full min-h-[80px] p-2 text-sm border rounded-md resize-none"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddFAQ} disabled={isAdding}>
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add"
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                disabled={isAdding}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {filteredFaqs.length} FAQ{filteredFaqs.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading FAQs...</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <Card
                key={faq.id}
                ref={(el) => {
                  faqRefs.current[index] = el;
                }}
                className="hover:shadow-md transition-all duration-200"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm leading-tight">
                      {faq.question}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => startEditingFAQ(faq)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteFAQ(faq.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {editingFAQId === faq.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editingQuestion}
                        onChange={(e) => setEditingQuestion(e.target.value)}
                        className="text-sm"
                      />
                      <textarea
                        value={editingAnswer}
                        onChange={(e) => setEditingAnswer(e.target.value)}
                        className="w-full min-h-[60px] p-2 text-sm border rounded-md resize-none"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveFAQ(faq.id)}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingFAQId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <CardDescription className="text-xs leading-relaxed">
                      {faq.answer}
                    </CardDescription>
                  )}
                </CardContent>
              </Card>
            ))
          )}

          {filteredFaqs.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No FAQs found</p>
              {searchTerm && (
                <p className="text-xs mt-1">Try a different search term</p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
