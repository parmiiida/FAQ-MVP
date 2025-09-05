"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Bot, MessageSquare, BarChart3, Settings, HelpCircle,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  {
    name: "Assistants",
    href: "/dashboard/assistants",
    icon: Bot,
    children: [
      { name: "Manage Assistants", href: "/dashboard/assistants" },
      { name: "Create New", href: "/dashboard/assistants/create" },
    ],
  },
  {
    name: "FAQs",
    href: "/dashboard/faq",
    icon: HelpCircle,
    children: [
      { name: "Manage FAQs", href: "/dashboard/faq" },
      { name: "Add FAQ", href: "/dashboard/faq/create" },
    ],
  },
  { name: "Chat & Test", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    children: [
      { name: "Profile", href: "/dashboard/settings/profile" },
      { name: "AI Behavior", href: "/dashboard/settings/ai-behavior" },
      { name: "Embedding", href: "/dashboard/settings/embedding" },
      { name: "Multi-language", href: "/dashboard/settings/language" },
      { name: "File Uploads", href: "/dashboard/settings/uploads" },
    ],
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    children: [
      { name: "Subscription", href: "/dashboard/billing" },
      { name: "Upgrade to Pro", href: "/dashboard/billing/upgrade" },
      { name: "Billing History", href: "/dashboard/billing/history" },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const isChildActive = (children: any[]) => {
    return children.some((child) => pathname === child.href);
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-40",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg text-foreground">AI Assistant</span>
          )}
        </div>
      </div>

      <nav className="mt-6 px-2">
        {navigation.map((item) => {
          const hasActiveChild = item.children && isChildActive(item.children);
          const isItemActive = isActive(item.href);

          return (
            <div key={item.name} className="mb-1">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  (isItemActive || hasActiveChild)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>

              {!isCollapsed && item.children && (isItemActive || hasActiveChild) && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block px-3 py-1 text-sm rounded transition-colors",
                        pathname === child.href
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
