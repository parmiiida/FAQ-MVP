'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { ChatArea } from '@/components/ChatArea';
import { KnowledgeBaseSidebar } from '@/components/KnowledgeBaseSidebar';
import { Sidebar, SidebarContent, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import { gsap } from 'gsap';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth';
    }
  }, [user, loading]);

  useEffect(() => {
    // Initial animation
    if (dashboardRef.current) {
      gsap.set(dashboardRef.current, { opacity: 0 });
      gsap.to(dashboardRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
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
    <SidebarProvider>
      <div ref={dashboardRef} className="min-h-screen flex w-full bg-background">
        {/* Mobile KB Sidebar */}
        <Sidebar className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent>
            <KnowledgeBaseSidebar onClose={() => setSidebarOpen(false)} />
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header />

          {/* Mobile KB Toggle */}
          <div className="lg:hidden p-4 border-b">
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

          {/* Chat Area */}
          <div className="flex-1 flex">
            <ChatArea />

            {/* Desktop KB Sidebar */}
            <div className="hidden lg:block w-80 border-l bg-muted/5">
              <KnowledgeBaseSidebar />
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;