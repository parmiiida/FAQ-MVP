'use client'

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Crown,
  Check,
  ArrowRight,
  Zap,
  Shield,
  Headphones,
  BarChart3,
  Users,
  Bot
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

const BillingDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(false);
  const [usage] = useState({
    assistants: 1,
    faqs: 5,
    conversations: 23,
    limit: {
      assistants: 3,
      faqs: 50,
      conversations: 100
    }
  });

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Perfect for trying out our platform',
      features: [
        'Up to 3 AI assistants',
        'Up to 50 FAQs',
        '100 conversations/month',
        'Basic analytics',
        'Email support'
      ],
      popular: false,
      color: 'border-border'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      period: 'month',
      description: 'Best for growing businesses',
      features: [
        'Unlimited AI assistants',
        'Unlimited FAQs',
        'Unlimited conversations',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'API access',
        'Multi-language support'
      ],
      popular: true,
      color: 'border-primary'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      period: 'month',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security',
        'SLA guarantees',
        'Custom deployment',
        'Training & onboarding'
      ],
      popular: false,
      color: 'border-purple-500'
    }
  ];

  useEffect(() => {
    // Animate plan cards with bounce effect
    gsap.fromTo('.plan-card',
      { opacity: 0, y: 50, rotationY: 15 },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)'
      }
    );

    // Animate usage cards with slide from left
    gsap.fromTo('.usage-card',
      { opacity: 0, x: -50, scale: 0.9 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out'
      }
    );

    // Add floating animation to plan cards
    gsap.to('.plan-card', {
      y: -5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
      stagger: 0.3,
      delay: 1
    });

    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');

      if (error) throw error;

      if (data) {
        setCurrentPlan(data.plan || 'free');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleUpgrade = async (plan: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId: plan.id,
          planName: plan.name,
          planPrice: plan.price
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanHover = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      y: -10,
      rotationY: 5,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handlePlanLeave = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      y: 0,
      rotationY: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and view usage statistics
        </p>
      </div>

      {/* Current Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="usage-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Assistants</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.assistants}/{usage.limit.assistants}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${getUsagePercentage(usage.assistants, usage.limit.assistants)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {usage.limit.assistants - usage.assistants} remaining
            </p>
          </CardContent>
        </Card>

        <Card className="usage-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FAQs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.faqs}/{usage.limit.faqs}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${getUsagePercentage(usage.faqs, usage.limit.faqs)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {usage.limit.faqs - usage.faqs} remaining
            </p>
          </CardContent>
        </Card>

        <Card className="usage-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.conversations}/{usage.limit.conversations}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${getUsagePercentage(usage.conversations, usage.limit.conversations)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {usage.limit.conversations - usage.conversations} remaining this month
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
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "plan-card relative cursor-pointer transition-all duration-300 hover:shadow-xl",
                plan.color,
                currentPlan === plan.id && "ring-2 ring-primary",
                plan.popular && "border-2 border-primary shadow-lg"
              )}
              onMouseEnter={handlePlanHover}
              onMouseLeave={handlePlanLeave}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
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
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {currentPlan === plan.id ? (
                  <div className="space-y-2">
                    <Button className="w-full" disabled>
                      Current Plan
                    </Button>
                    {plan.id !== 'free' && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleManageSubscription}
                        disabled={loading}
                      >
                        Manage Subscription
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    className="w-full group"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => plan.price === 0 ? null : handleUpgrade(plan)}
                    disabled={loading || plan.price === 0}
                  >
                    {loading ? 'Processing...' : (plan.price === 0 ? 'Contact Support' : 'Upgrade to ' + plan.name)}
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
        <Button variant="outline" onClick={() => router.push('/dashboard/billing/history')}>
          <CreditCard className="w-4 h-4 mr-2" />
          Billing History
        </Button>
        <Button variant="outline">
          <Headphones className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default BillingDashboard;