"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Bell, Bot, X, Send, MinusCircle, MaximizeIcon as Maximize } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import gsap from "gsap";

function toggleTheme() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const isDark = root.classList.toggle("dark");
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch (_) {}
}

interface TopBarProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const TopBar = ({ onToggleSidebar, isSidebarCollapsed }: TopBarProps) => {
  const { user, signOut } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I'm your AI assistant. How can I help you today?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [notificationCount] = useState(3);
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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: newMessage },
      { role: "assistant", content: "I understand your question. Let me help you with that!" },
    ]);
    setNewMessage("");
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
          "fixed top-0 right-0 h-16 bg-card border-b border-border z-30 flex items-center justify-between px-6 transition-all duration-300",
          isSidebarCollapsed ? "left-16" : "left-64"
        )}
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onToggleSidebar}>
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">AI Assistant Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="hidden md:inline text-sm">Theme</span>
          </Button>

          {/* Robot Chat Button */}
          <Button variant="ghost" size="sm" onClick={toggleChat} className="relative group">
            <Bot className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {user?.user_metadata?.name?.[0] || user?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.user_metadata?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
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
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
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
      {chatOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={toggleChat} />}
    </>
  );
};

export default TopBar;
