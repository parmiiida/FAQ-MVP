"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Crown,
  Check,
  ArrowRight,
  Headphones,
  BarChart3,
  Users,
  Bot,
} from "lucide-react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { cn } from "@/lib/utils";

type Plan = {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  color: string;
};

type Usage = {
  assistants: number;
  faqs: number;
  conversations: number;
  limit: {
    assistants: number;
    faqs: number;
    conversations: number;
  };
};

// Mock usage data
const initialUsage: Usage = {
  assistants: 1,
  faqs: 5,
  conversations: 23,
  limit: { assistants: 3, faqs: 50, conversations: 100 },
};

// Subscription plans
const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "month",
    description: "Perfect for trying out our platform",
    features: [
      "Up to 3 AI assistants",
      "Up to 50 FAQs",
      "100 conversations/month",
      "Basic analytics",
      "Email support",
    ],
    popular: false,
    color: "border-border",
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "month",
    description: "Best for growing businesses",
    features: [
      "Unlimited AI assistants",
      "Unlimited FAQs",
      "Unlimited conversations",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
      "Multi-language support",
    ],
    popular: true,
    color: "border-primary",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security",
      "SLA guarantees",
      "Custom deployment",
      "Training & onboarding",
    ],
    popular: false,
    color: "border-purple-500",
  },
];

const BillingDashboard = () => {
  const router = useRouter();
  const [currentPlan] = useState<string>("free");
  const [usage] = useState<Usage>(initialUsage);

  // Refs for GSAP animations
  const usageRefs = useRef<HTMLDivElement[]>([]);
  const planRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.fromTo(
      usageRefs.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      planRefs.current,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
      }
    );
  }, []);

  const getRemaining = (used: number, limit: number) => limit - used;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription and view usage statistics
        </p>
      </div>

      {/* Current Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card ref={(el) => { if (el) { usageRefs.current[0] = el; } }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Assistants</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.assistants}/{usage.limit.assistants}
            </div>
            <progress
              className="w-full h-2 mt-2 rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary"
              value={usage.assistants}
              max={usage.limit.assistants}
              aria-label="AI Assistants usage"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {getRemaining(usage.assistants, usage.limit.assistants)} remaining
            </p>
          </CardContent>
        </Card>

        <Card ref={(el) => { if (el) { usageRefs.current[1] = el; } }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">FAQs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.faqs}/{usage.limit.faqs}
            </div>
            <progress
              className="w-full h-2 mt-2 rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary"
              value={usage.faqs}
              max={usage.limit.faqs}
              aria-label="FAQs usage"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {getRemaining(usage.faqs, usage.limit.faqs)} remaining
            </p>
          </CardContent>
        </Card>

        <Card ref={(el) => { if (el) { usageRefs.current[2] = el; } }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.conversations}/{usage.limit.conversations}
            </div>
            <progress
              className="w-full h-2 mt-2 rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary"
              value={usage.conversations}
              max={usage.limit.conversations}
              aria-label="Conversations usage"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {getRemaining(usage.conversations, usage.limit.conversations)}{" "}
              remaining this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Choose Your Plan</h2>
          <p className="text-muted-foreground">
            Upgrade to unlock more features and higher limits
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              ref={(el) => { if (el) { planRefs.current[index] = el; } }}
              className={cn(
                "relative transition-all duration-300 hover:shadow-xl",
                plan.color,
                currentPlan === plan.id && "ring-2 ring-primary",
                plan.popular && "border-2 border-primary shadow-lg"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-lg font-normal text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {currentPlan === plan.id ? (
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full group"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() =>
                      router.push(`/dashboard/billing/upgrade?plan=${plan.id}`)
                    }
                  >
                    {plan.price === 0 ? "Downgrade" : `Upgrade to ${plan.name}`}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/billing/history")}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Billing History
        </Button>
        <Button asChild variant="outline">
          <a href="mailto:support@yourapp.com">
            <Headphones className="w-4 h-4 mr-2" />
            Contact Support
          </a>
        </Button>
      </div>
    </div>
  );
};

export default BillingDashboard;
