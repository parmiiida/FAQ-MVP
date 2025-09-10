import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import gsap from "gsap";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const FloatingRobot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. I can help you navigate the platform, answer questions about features, or assist with your AI assistants. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const robotRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Floating animation for the robot
    if (robotRef.current) {
      gsap.to(robotRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && chatRef.current) {
      gsap.fromTo(
        chatRef.current,
        { scale: 0, opacity: 0, transformOrigin: "bottom right" },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  const toggleChat = () => {
    if (isOpen && chatRef.current) {
      gsap.to(chatRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setIsOpen(false),
      });
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage = newMessage;
    setNewMessage("");
    setIsLoading(true);

    // Add user message
    const updatedMessages = [
      ...messages,
      {
        role: "user" as const,
        content: userMessage,
        timestamp: new Date(),
      },
    ];
    setMessages(updatedMessages);

    try {
      // Call AI assistant with full conversation context
      const { data, error } = await supabase.functions.invoke("chat-with-ai", {
        body: {
          message: userMessage,
          context: {
            type: "homepage_assistant",
            user_id: user?.id,
            page: window.location.pathname,
            conversation_history: updatedMessages.slice(-10), // Send last 10 messages for context
          },
        },
      });

      if (error) throw error;

      // Add AI response
      const aiMsg: Message = {
        role: "assistant",
        content:
          data.response ||
          "I apologize, but I encountered an issue. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        role: "assistant",
        content:
          "Sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Robot Button */}
      <div ref={robotRef} className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={toggleChat}
          className={cn(
            "w-16 h-16 rounded-full shadow-2xl transition-all duration-300 group",
            "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary",
            "border-4 border-background"
          )}
        >
          {isOpen ? (
            <X className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform" />
          ) : (
            <Bot className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform" />
          )}
        </Button>

        {/* Notification dot */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-background" />
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatRef}
          className={cn(
            "fixed bottom-24 right-6 w-96 h-[500px] bg-card border border-border rounded-2xl shadow-2xl z-40 flex flex-col",
            "backdrop-blur-xl bg-card/95",
            isMinimized ? "h-16" : "h-[500px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border rounded-t-2xl bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">
                  Always here to help
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 p-0"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] p-3 rounded-2xl",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      )}
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground p-3 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1 rounded-full border-primary/20 focus:border-primary"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                    size="sm"
                    className="rounded-full w-10 h-10 p-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingRobot;
