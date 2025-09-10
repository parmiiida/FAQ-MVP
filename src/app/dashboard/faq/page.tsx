"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Filter,
  ArrowUpDown,
  HelpCircle,
} from "lucide-react";
import gsap from "gsap";

const ManageFAQs = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data - replace with real data from Supabase
  const [faqs] = useState([
    {
      id: "1",
      question: "How do I create a new AI assistant?",
      answer:
        'Navigate to the Assistants section and click "Create New" to start building your assistant.',
      category: "Getting Started",
      tags: ["setup", "assistant"],
      isVisible: true,
      sortOrder: 1,
    },
    {
      id: "2",
      question: "What is the difference between free and pro plans?",
      answer:
        "Pro plan includes unlimited assistants, advanced analytics, and priority support.",
      category: "Billing",
      tags: ["pricing", "plans"],
      isVisible: true,
      sortOrder: 2,
    },
    {
      id: "3",
      question: "How can I customize my assistant's personality?",
      answer:
        "Go to Settings > AI Behavior to configure tone, personality, and response style.",
      category: "Customization",
      tags: ["personality", "settings"],
      isVisible: false,
      sortOrder: 3,
    },
  ]);

  const categories = [
    "all",
    "Getting Started",
    "Billing",
    "Customization",
    "Technical",
  ];

  useEffect(() => {
    gsap.fromTo(
      ".faq-item",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }, []);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCardHover = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1.02,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleCardLeave = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/faqs/categories")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Categories
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={() => router.push("/dashboard/faqs/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      {filteredFAQs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first FAQ."}
            </p>
            <Button onClick={() => router.push("/dashboard/faqs/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create First FAQ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <Card
              key={faq.id}
              className="faq-item cursor-pointer hover:shadow-md transition-shadow"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {faq.answer}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {faq.isVisible ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground cursor-move" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{faq.category}</Badge>
                    <div className="flex gap-1">
                      {faq.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      {faq.isVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageFAQs;
