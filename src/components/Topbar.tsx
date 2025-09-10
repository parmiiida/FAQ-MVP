import React, { useState, useRef, useEffect, use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  Bell,
  Bot,
  X,
  Send,
  MinusCircle,
  MaximizeIcon as Maximize,
  ChevronDown,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import gsap from "gsap";

interface TopBarProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const TopBar = ({ onToggleSidebar, isSidebarCollapsed }: TopBarProps) => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [notificationCount] = useState(3);
  const chatRef = useRef<HTMLDivElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatOpen && chatPanelRef.current) {
      gsap.fromTo(
        chatPanelRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [chatOpen]);

  const toggleChat = () => {
    if (chatOpen && chatPanelRef.current) {
      gsap.to(chatPanelRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setChatOpen(false),
      });
    } else {
      setChatOpen(true);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = newMessage;
    setNewMessage("");

    // Add user message
    const updatedMessages = [
      ...chatMessages,
      { role: "user", content: userMessage },
    ];
    setChatMessages(updatedMessages);

    try {
      // Call AI assistant with full conversation context
      const { data, error } = await supabase.functions.invoke("chat-with-ai", {
        body: {
          message: userMessage,
          context: {
            type: "dashboard_help",
            user_id: user?.id,
            conversation_history: updatedMessages.slice(-10), // Send last 10 messages for context
          },
        },
      });

      if (error) throw error;

      // Add AI response
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.response ||
            "I apologize, but I encountered an issue. Please try again.",
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble responding right now. Please try again later.",
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 h-[65px] bg-card border-b border-border z-30 flex items-center justify-between px-6 transition-all duration-300",
          isSidebarCollapsed ? "left-16" : "left-64"
        )}
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onToggleSidebar}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center"
              >
                {notificationCount}
              </Badge>
            )}
          </Button> */}

          {/* Robot Chat Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleChat}
            className="relative group"
          >
            <Bot className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 hover:bg-muted/50"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-sm">
                    {user?.user_metadata?.name?.[0] || user?.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">
                    {user?.user_metadata?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-card border-border"
            >
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
                className="cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/billing")}
                className="cursor-pointer"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={signOut}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Chat Panel */}
      {chatOpen && (
        <div
          ref={chatPanelRef}
          className="fixed right-0 top-0 h-full w-96 bg-card border-l border-border z-50 flex flex-col shadow-2xl"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <MinusCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Maximize className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleChat}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={toggleChat} />
      )}
    </>
  );
};

export default TopBar;
