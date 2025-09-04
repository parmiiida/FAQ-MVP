"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Bot,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const DashboardHome = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Animate cards on load
    gsap.fromTo(
      ".stat-card",
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      ".welcome-section",
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.user_metadata?.name || user?.email}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your AI assistants, FAQs, and analytics from your dashboard.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className="stat-card cursor-pointer hover:shadow-lg transition-shadow"
          onMouseEnter={handleCardHover}
          onMouseLeave={handleCardLeave}
          onClick={() => router.push("/dashboard/assistants")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assistants</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Ready to create your first
            </p>
          </CardContent>
        </Card>

        <Card
          className="stat-card cursor-pointer hover:shadow-lg transition-shadow"
          onMouseEnter={handleCardHover}
          onMouseLeave={handleCardLeave}
          onClick={() => router.push("/dashboard/faqs")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total FAQs</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <Plus className="w-3 h-3 inline mr-1" />
              Add your first FAQ
            </p>
          </CardContent>
        </Card>

        <Card
          className="stat-card cursor-pointer hover:shadow-lg transition-shadow"
          onMouseEnter={handleCardHover}
          onMouseLeave={handleCardLeave}
          onClick={() => router.push("/dashboard/chat")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="w-3 h-3 inline mr-1" />
              Start chatting today
            </p>
          </CardContent>
        </Card>

        <Card
          className="stat-card cursor-pointer hover:shadow-lg transition-shadow"
          onMouseEnter={handleCardHover}
          onMouseLeave={handleCardLeave}
          onClick={() => router.push("/dashboard/analytics")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View</div>
            <p className="text-xs text-muted-foreground">
              <BarChart3 className="w-3 h-3 inline mr-1" />
              Track performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="stat-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Assistants
            </CardTitle>
            <CardDescription>Create and manage your AI assistants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No assistants yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Get started by creating your first AI assistant. You can customize its behavior, add
                knowledge, and start chatting.
              </p>
              <Button onClick={() => router.push("/dashboard/assistants/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Assistant
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Knowledge Base
            </CardTitle>
            <CardDescription>Manage FAQs and knowledge base entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No FAQs yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Build your knowledge base by adding frequently asked questions and their answers.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push("/dashboard/faqs/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard/faqs")}>
                  Manage FAQs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
