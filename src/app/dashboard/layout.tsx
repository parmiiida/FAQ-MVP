"use client";

import React, { useState, useEffect } from "react";
import TopBar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // assuming you have this

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth(); // make sure your context exposes loading+user

  useEffect(() => {
    // Initial animation
    gsap.fromTo(
      ".dashboard-content",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth"); // redirect unauthenticated users
    }
  }, [user, loading, router]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <TopBar
        onToggleSidebar={toggleSidebar}
        isSidebarCollapsed={sidebarCollapsed}
      />

      <main
        className={cn(
          "dashboard-content transition-all duration-300 pt-16",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
