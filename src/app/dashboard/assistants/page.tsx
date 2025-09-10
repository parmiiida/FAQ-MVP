// app/dashboard/assistants/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Assistant = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean | null;
  total_chats?: number;
  created_at: string;
  tone?: string | null;
  personality?: string | null;
};

export default function AssistantsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchAssistants();
    }
  }, [user?.id]);

  // Refresh assistants when page becomes visible (e.g., returning from create page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        fetchAssistants();
      }
    };

    const handleFocus = () => {
      if (user?.id) {
        fetchAssistants();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user?.id]);

  const fetchAssistants = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("assistants")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAssistants(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch assistants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAssistants = assistants.filter(
    (assistant) =>
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (assistant.description &&
        assistant.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteAssistant = async (assistantId: string) => {
    if (!confirm("Are you sure you want to delete this assistant?")) return;

    try {
      const { error } = await supabase
        .from("assistants")
        .delete()
        .eq("id", assistantId);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Assistant deleted successfully",
      });
      fetchAssistants();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assistant",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-8">Loading assistants...</div>;
  }

  return (
    <div>
      <div className="px-4 lg:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex gap-2 mt-4 lg:mt-0 justify-between w-full">
            <div className="relative max-w-md flex-1">
              <Search className="absolute flex left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assistants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="gap-3 flex">
              <Button
                variant="outline"
                onClick={() => fetchAssistants()}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                className="bg-gradient-primary hover:opacity-90 shadow-glow"
                onClick={() => router.push("/dashboard/assistants/create")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Assistant
              </Button>
            </div>
          </div>
        </div>

        {/* Assistants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssistants.map((assistant) => (
            <Card key={assistant.id} className="assistant-card">
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
                        variant={assistant.is_active ? "default" : "secondary"}
                        className={
                          assistant.is_active
                            ? "bg-success text-success-foreground"
                            : ""
                        }
                      >
                        {assistant.is_active ? "active" : "inactive"}
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
                          router.push(
                            `/dashboard/assistants/${assistant.id}/chat`
                          )
                        }
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Test Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/assistants/${assistant.id}/edit`
                          )
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
                    {assistant.total_chats || 0} chats
                  </div>
                  <div>
                    Created:{" "}
                    {new Date(assistant.created_at).toLocaleDateString()}
                  </div>
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
              <h3 className="text-lg font-semibold mb-2">
                No assistants found
              </h3>
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
