import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Search, Edit, Trash2, Upload, X, ChevronDown, ChevronRight, GripVertical, MessageCircle, Globe } from 'lucide-react';
import { gsap } from 'gsap';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AddFAQModal } from './AddFAQModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

  interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category_id: string | null;
    tags: string[];
    is_visible: boolean;
    sort_order: number;
    created_at: string;
  }

  interface Category {
    id: string;
    name: string;
    description: string;
    color: string;
    sort_order: number;
  }

interface EnhancedKnowledgeBaseSidebarProps {
  onClose?: () => void;
}

const SortableFAQCard: React.FC<{
  faq: FAQItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ faq, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: faq.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="hover:shadow-md transition-all duration-200 group"
    >
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-sm leading-tight">{faq.question}</CardTitle>
            {faq.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {faq.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(faq.id)}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={() => onDelete(faq.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {faq.answer}
        </p>
        {!faq.is_visible && (
          <Badge variant="secondary" className="mt-2 text-xs">
            Hidden
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export const EnhancedKnowledgeBaseSidebar: React.FC<EnhancedKnowledgeBaseSidebarProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [activePreview, setActivePreview] = useState<'chatbot' | 'website'>('chatbot');
  const [loading, setLoading] = useState(true);

  const sidebarRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.set(sidebarRef.current.children, { opacity: 0, y: 20 });
      gsap.to(sidebarRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Load categories first
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('faq_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order');

      if (categoriesError) throw categoriesError;

      // If no categories exist, create default ones
      if (!categoriesData || categoriesData.length === 0) {
        await supabase.functions.invoke('create_default_categories_for_user', {
          body: { user_id: user.id }
        });
        // Reload categories
        const { data: newCategoriesData } = await supabase
          .from('faq_categories')
          .select('*')
          .eq('user_id', user.id)
          .order('sort_order');
        setCategories(newCategoriesData || []);
      } else {
        setCategories(categoriesData);
      }

      // Load FAQs
      const { data: faqsData, error: faqsError } = await supabase
        .from('faqs')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order');

      if (faqsError) throw faqsError;
      setFaqs(faqsData || []);

      // Open first category by default
      if (categoriesData && categoriesData.length > 0) {
        setOpenCategories(new Set([(categoriesData[0] as any).id]));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load knowledge base data');
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedFaqs = categories.reduce((acc, category) => {
    acc[category.id] = filteredFaqs.filter(faq => faq.category_id === category.id);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Find which category this FAQ belongs to
    const activeFaq = faqs.find(faq => faq.id === active.id);
    if (!activeFaq) return;

    const categoryFaqs = groupedFaqs[activeFaq.category_id || ''] || [];
    const oldIndex = categoryFaqs.findIndex(faq => faq.id === active.id);
    const newIndex = categoryFaqs.findIndex(faq => faq.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(categoryFaqs, oldIndex, newIndex);

      // Update local state
      const updatedFaqs = faqs.map(faq => {
        const newOrderIndex = newOrder.findIndex(orderFaq => orderFaq.id === faq.id);
        if (newOrderIndex !== -1) {
          return { ...faq, sort_order: newOrderIndex };
        }
        return faq;
      });
      setFaqs(updatedFaqs);

      // Update database
      try {
        const updates = newOrder.map((faq, index) => ({
          id: faq.id,
          sort_order: index
        }));

        for (const update of updates) {
          await (supabase as any)
            .from('faqs')
            .update({ sort_order: update.sort_order })
            .eq('id', update.id);
        }
      } catch (error) {
        console.error('Error updating FAQ order:', error);
        toast.error('Failed to update FAQ order');
        // Reload data to reset state
        loadData();
      }
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFaqs(faqs.filter(faq => faq.id !== id));
      toast.success('FAQ deleted successfully');
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  };

  const handleEditFAQ = (id: string) => {
    // TODO: Implement edit functionality
    toast.info('Edit functionality coming soon!');
  };

  const toggleCategory = (categoryId: string) => {
    const newOpenCategories = new Set(openCategories);
    if (newOpenCategories.has(categoryId)) {
      newOpenCategories.delete(categoryId);
    } else {
      newOpenCategories.add(categoryId);
    }
    setOpenCategories(newOpenCategories);
  };

  const handleCreateCategory = async (name: string) => {
    // Reload categories after creation
    loadData();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Implement file processing
    console.log('File uploaded:', file.name);
    toast.info('File upload functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={sidebarRef} className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Knowledge Base</h3>
          <p className="text-sm text-muted-foreground">Manage your FAQs</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search & Actions */}
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
            variant="default"
            size="sm"
            onClick={() => setShowAddModal(true)}
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

      {/* Preview Toggle */}
      <div className="px-4 pb-2">
        <Tabs value={activePreview} onValueChange={(value) => setActivePreview(value as 'chatbot' | 'website')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chatbot" className="text-xs">
              <MessageCircle className="h-3 w-3 mr-1" />
              Chatbot
            </TabsTrigger>
            <TabsTrigger value="website" className="text-xs">
              <Globe className="h-3 w-3 mr-1" />
              Website
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* FAQ List by Categories */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">
              {filteredFaqs.length} FAQ{filteredFaqs.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {categories.map((category) => {
              const categoryFaqs = groupedFaqs[category.id] || [];
              const isOpen = openCategories.has(category.id);

              if (searchTerm && categoryFaqs.length === 0) {
                return null;
              }

              return (
                <Collapsible
                  key={category.id}
                  open={isOpen}
                  onOpenChange={() => toggleCategory(category.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between h-auto p-3 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {categoryFaqs.length}
                        </Badge>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    <SortableContext
                      items={categoryFaqs.map(faq => faq.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {categoryFaqs.map((faq) => (
                        <SortableFAQCard
                          key={faq.id}
                          faq={faq}
                          onEdit={handleEditFAQ}
                          onDelete={handleDeleteFAQ}
                        />
                      ))}
                    </SortableContext>
                    {categoryFaqs.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">No FAQs in this category</p>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </DndContext>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No FAQs found</p>
              {searchTerm && (
                <p className="text-xs mt-1">Try a different search term</p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <AddFAQModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={loadData}
        categories={categories}
        onCreateCategory={handleCreateCategory}
      />
    </div>
  );
};