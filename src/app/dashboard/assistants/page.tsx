// app/dashboard/assistants/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Plus,
  Search,
  MessageSquare,
  Settings,
  MoreHorizontal,
  Play,
  Trash2,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockAssistants = [
  {
    id: "1",
    name: "Customer Support Bot",
    description:
      "Handles customer inquiries and provides support across multiple channels",
    status: "active",
    totalChats: 145,
    totalMessages: 892,
    lastUsed: "2 hours ago",
    createdAt: "2024-01-15",
    tags: ["customer-service", "support"],
  },
  {
    id: "2",
    name: "Product Helper",
    description: "Provides detailed product information and recommendations",
    status: "active",
    totalChats: 28,
    totalMessages: 156,
    lastUsed: "5 hours ago",
    createdAt: "2024-01-20",
    tags: ["products", "recommendations"],
  },
  {
    id: "3",
    name: "FAQ Assistant",
    description: "Answers frequently asked questions about our services",
    status: "inactive",
    totalChats: 72,
    totalMessages: 234,
    lastUsed: "1 day ago",
    createdAt: "2024-01-10",
    tags: ["faq", "general"],
  },
  {
    id: "4",
    name: "Sales Assistant",
    description: "Helps with sales inquiries and lead qualification",
    status: "active",
    totalChats: 89,
    totalMessages: 445,
    lastUsed: "4 hours ago",
    createdAt: "2024-01-25",
    tags: ["sales", "leads"],
  },
];

export default function AssistantsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssistants = mockAssistants.filter(
    (assistant) =>
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteAssistant = (assistantId: string) => {
    console.log("Delete assistant:", assistantId);
    // In real app, call delete API here
  };

  return (
    <div>
      <div className="px-4 lg:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Assistants</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your AI assistants
            </p>
          </div>
          <Button
            className="mt-4 lg:mt-0 bg-gradient-primary hover:opacity-90 shadow-glow"
            onClick={() => router.push("/dashboard/assistants/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Assistant
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assistants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Assistants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssistants.map((assistant) => (
            <Card
              key={assistant.id}
              className="bg-gradient-card border-0 shadow-dashboard-md hover:shadow-dashboard-lg transition-all duration-200"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold truncate">
                        {assistant.name}
                      </CardTitle>
                      <Badge
                        variant={
                          assistant.status === "active" ? "default" : "secondary"
                        }
                        className={
                          assistant.status === "active"
                            ? "bg-success text-success-foreground"
                            : ""
                        }
                      >
                        {assistant.status}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/assistants/${assistant.id}/chat`)
                        }
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Test Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/assistants/${assistant.id}/edit`)
                        }
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/assistants/${assistant.id}/knowledge`
                          )
                        }
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Knowledge Base
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteAssistant(assistant.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {assistant.description}
                </CardDescription>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {assistant.totalChats} chats
                  </div>
                  <div>Last used: {assistant.lastUsed}</div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {assistant.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/dashboard/assistants/${assistant.id}/chat`)
                    }
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/dashboard/assistants/${assistant.id}/edit`)
                    }
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAssistants.length === 0 && (
          <Card className="bg-gradient-card border-0 shadow-dashboard-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bot className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assistants found</h3>
              <p className="text-muted-foreground text-center mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first AI assistant"}
              </p>
              {!searchQuery && (
                <Button
                  className="bg-gradient-primary hover:opacity-90 shadow-glow"
                  onClick={() => router.push("/dashboard/assistants/create")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Assistant
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
