// app/dashboard/analytics/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, MessageSquare, TrendingUp, Users } from "lucide-react";

export default function AnalyticsPage() {
  const [messageActivityWidths, setMessageActivityWidths] = useState<number[]>([]);
  const [messageActivityCounts, setMessageActivityCounts] = useState<number[]>([]);

  useEffect(() => {
    setMessageActivityWidths(
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
    );
    setMessageActivityCounts(
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 200))
    );
  }, []);
  return (
    <div>
      <div className="px-4 lg:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your AI assistants' performance and usage
          </p>
        </div>

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
              <CardDescription>Messages over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, index) => (
                    <div key={day} className="flex items-center">
                      <span className="w-8 text-sm text-muted-foreground">
                        {day}
                      </span>
                      <div className="flex-1 mx-3">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                            style={{ width: `${messageActivityWidths[index] ?? 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {messageActivityCounts[index] ?? 0}
                      </span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Questions */}
          <Card className="bg-gradient-card border-0 shadow-dashboard-md">
            <CardHeader>
              <CardTitle>Top Questions</CardTitle>
              <CardDescription>
                Most frequently asked questions
              </CardDescription>
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
                      <span className="text-sm font-medium">
                        {item.value}%
                      </span>
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
                {["9 AM", "12 PM", "3 PM", "6 PM", "9 PM"].map((time, index) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
