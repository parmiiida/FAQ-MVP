// app/dashboard/analytics/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function AnalyticsPage() {
  type RecentActivityItem = {
    id: string;
    type: string;
    data: any;
    timestamp: string;
  };
  type TopQuestion = { question: string; count: number };

  const { user } = useAuth();
  const { toast } = useToast();

  const [messageActivityWidths, setMessageActivityWidths] = useState<number[]>(
    []
  );
  const [messageActivityCounts, setMessageActivityCounts] = useState<number[]>(
    []
  );
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>(
    []
  );
  const [topQuestions, setTopQuestions] = useState<TopQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssistants: 0,
    totalConversations: 0,
    totalMessages: 0,
    totalFAQs: 0,
    activeAssistants: 0,
  });

  useEffect(() => {
    setMessageActivityWidths(
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
    );
    setMessageActivityCounts(
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 200))
    );
  }, []);
  const fetchAnalytics = async (userId: string) => {
    try {
      // Fetch basic stats
      const [assistantsRes, faqsRes, analyticsRes, chatSessionsRes] =
        await Promise.all([
          supabase
            .from("assistants")
            .select("id, is_active")
            .eq("user_id", userId),
          supabase
            .from("faqs")
            .select("id, assistant_id")
            .in(
              "assistant_id",
              await supabase
                .from("assistants")
                .select("id")
                .eq("user_id", userId)
                .then((res) => res.data?.map((a) => a.id) || [])
            ),
          supabase
            .from("analytics")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(50),
          supabase
            .from("chat_sessions")
            .select("*")
            .order("last_activity", { ascending: false })
            .limit(20),
        ]);

      const assistants = assistantsRes.data || [];
      const faqs = faqsRes.data || [];
      const analytics = analyticsRes.data || [];
      const chatSessions = chatSessionsRes.data || [];

      setStats({
        totalAssistants: assistants.length,
        activeAssistants: assistants.filter((a) => a.is_active).length,
        totalFAQs: faqs.length,
        totalConversations: chatSessions.length,
        totalMessages: analytics.filter((a) => a.event_type === "chat_message")
          .length,
      });

      // Process recent activity
      const activity = analytics.slice(0, 10).map((item) => ({
        id: item.id,
        type: item.event_type,
        data: item.event_data,
        timestamp: item.created_at,
      }));
      setRecentActivity(activity);

      // Process top questions (mock data for now)
      const questions = [
        { question: "How do I create a new assistant?", count: 15 },
        { question: "What are the pricing plans?", count: 12 },
        { question: "How to customize the chat widget?", count: 8 },
        { question: "Can I export my data?", count: 6 },
        { question: "How to add FAQs?", count: 5 },
      ];
      setTopQuestions(questions);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAnalytics(user.id);
    }
  }, [user?.id]);

  if (loading) {
    return <div className="p-8">Loading analytics...</div>;
  }
  return (
    <div>
      <div className="px-4 lg:px-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Messages */}
          <Card className="bg-gradient-card border-0 shadow-dashboard-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Messages
                  </p>
                  <p className="text-3xl font-bold text-foreground">1,247</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15% from last week
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="bg-gradient-card border-0 shadow-dashboard-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold text-foreground">89</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% from last week
                  </p>
                </div>
                <Users className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          {/* Response Rate */}
          <Card className="bg-gradient-card border-0 shadow-dashboard-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Response Rate
                  </p>
                  <p className="text-3xl font-bold text-foreground">98.5%</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2% from last week
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          {/* Avg Response Time */}
          <Card className="bg-gradient-card border-0 shadow-dashboard-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Response Time
                  </p>
                  <p className="text-3xl font-bold text-foreground">2.3s</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    -0.5s faster
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Message Activity */}
          <Card className="bg-gradient-card border-0 shadow-dashboard-md">
            <CardHeader>
              <CardTitle>Message Activity</CardTitle>
              <Activity className="w-4 h-4" />
              <CardDescription>Messages over the last 7 days</CardDescription>
            </CardHeader>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.type === "chat_message"
                          ? "New chat message"
                          : activity.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Top Questions */}
          <Card className="bg-gradient-card border-0 shadow-dashboard-md">
            <CardHeader>
              <CardTitle>Top Questions</CardTitle>
              <CardDescription>Most frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { question: "How do I reset my password?", count: 45 },
                  { question: "What are your support hours?", count: 32 },
                  { question: "How do I cancel my subscription?", count: 28 },
                  { question: "Where can I find my API keys?", count: 21 },
                  { question: "How do I upgrade my plan?", count: 18 },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm text-foreground flex-1 mr-2 truncate">
                      {item.question}
                    </p>
                    <span className="text-sm font-medium text-primary">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Response Quality */}
          <Card className="bg-gradient-card border-0 shadow-dashboard-md">
            <CardHeader>
              <CardTitle>Response Quality</CardTitle>
              <CardDescription>User satisfaction ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Excellent", value: 75, color: "bg-success" },
                  { label: "Good", value: 20, color: "bg-primary" },
                  { label: "Poor", value: 5, color: "bg-destructive" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assistant Performance */}
          <Card className="bg-gradient-card border-0 shadow-dashboard-md">
            <CardHeader>
              <CardTitle>Assistant Performance</CardTitle>
              <CardDescription>Individual assistant metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Customer Support Bot", usage: 85 },
                  { name: "Product Helper", usage: 67 },
                  { name: "FAQ Assistant", usage: 52 },
                ].map((assistant, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {assistant.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {assistant.usage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full">
                      <div
                        className="h-2 bg-gradient-primary rounded-full"
                        style={{ width: `${assistant.usage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage by Time */}
          <Card className="bg-gradient-card border-0 shadow-dashboard-md">
            <CardHeader>
              <CardTitle>Usage by Time</CardTitle>
              <CardDescription>Peak activity hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["9 AM", "12 PM", "3 PM", "6 PM", "9 PM"].map(
                  (time, index) => (
                    <div key={time} className="flex items-center">
                      <span className="w-12 text-xs text-muted-foreground">
                        {time}
                      </span>
                      <div className="flex-1 mx-2">
                        <div className="h-1.5 bg-muted rounded-full">
                          <div
                            className="h-1.5 bg-secondary rounded-full"
                            style={{
                              width: `${[65, 90, 45, 75, 30][index]}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium">
                        {[65, 90, 45, 75, 30][index]}%
                      </span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
