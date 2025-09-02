'use client'
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { ChatArea } from "@/components/ChatArea";
import { EnhancedKnowledgeBaseSidebar } from "@/components/EnhancedKnowledgeBaseSidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { gsap } from "gsap";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/auth";
    }
  }, [user, loading]);

  useEffect(() => {
    // Initial animation
    if (dashboardRef.current) {
      gsap.set(dashboardRef.current, { opacity: 0 });
      gsap.to(dashboardRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div ref={dashboardRef} className="min-h-screen flex w-full bg-background">
      {/* Mobile KB Sidebar */}
      {isMobile && (
        <>
          <div
            className={`fixed inset-y-0 left-0 z-50 w-80 bg-background border-r transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <EnhancedKnowledgeBaseSidebar
              onClose={() => setSidebarOpen(false)}
            />
          </div>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Desktop KB Sidebar */}
      {!isMobile && desktopSidebarOpen && (
        <div className="w-80 border-r bg-muted/5 flex-shrink-0">
          <EnhancedKnowledgeBaseSidebar
            onClose={() => setDesktopSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        {/* Mobile KB Toggle */}
        {isMobile && (
          <div className="p-4 border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2"
            >
              <PanelLeft className="h-4 w-4" />
              Knowledge Base
            </Button>
          </div>
        )}

        {/* Desktop KB Toggle */}
        {!isMobile && !desktopSidebarOpen && (
          <div className="p-4 border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDesktopSidebarOpen(true)}
              className="flex items-center gap-2"
            >
              <PanelLeft className="h-4 w-4" />
              Show Knowledge Base
            </Button>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1">
          <ChatArea />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
