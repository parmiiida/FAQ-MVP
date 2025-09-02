'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Crown, Zap, Shield, HeadphonesIcon, Download } from 'lucide-react';
import { gsap } from 'gsap';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  max_faqs: number;
  max_monthly_messages: number;
  is_active: boolean;
  sort_order: number;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  plan: SubscriptionPlan;
}

const Billing = () => {
  const { user, loading } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth';
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      loadBillingData();
    }
  }, [user]);

  useEffect(() => {
    if (pageRef.current) {
      gsap.set(pageRef.current.children, { opacity: 0, y: 30 });
      gsap.to(pageRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  }, [isLoading]);

  const loadBillingData = async () => {
    try {
      setIsLoading(true);

      // Load subscription plans
      const { data: plansData, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (plansError) throw plansError;
      const transformedPlans: SubscriptionPlan[] = (plansData || []).map((plan) => ({
        ...(plan as SubscriptionPlan),
        features: Array.isArray((plan as SubscriptionPlan).features)
          ? ((plan as SubscriptionPlan).features).map((f) => String(f))
          : []
      }));
      setPlans(transformedPlans);

      // Load user's current subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', user?.id || '')
        .maybeSingle();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError;
      }

      if (subscriptionData) {
        type SubscriptionRow = UserSubscription & { plan: SubscriptionPlan };
        const sub = subscriptionData as unknown as SubscriptionRow;

        const typedPlan: SubscriptionPlan = {
          ...sub.plan,
          features: Array.isArray(sub.plan.features)
            ? sub.plan.features.map((f) => String(f))
            : []
        };

        const transformedSubscription: UserSubscription = {
          ...sub,
          plan: typedPlan,
        };
        setCurrentSubscription(transformedSubscription);
      } else {
        setCurrentSubscription(null);
      }
    } catch (error) {
      console.error('Error loading billing data:', error);
      toast.error('Failed to load billing information');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return <Shield className="h-6 w-6 text-muted-foreground" />;
      case 'pro':
        return <Zap className="h-6 w-6 text-primary" />;
      case 'business':
        return <Crown className="h-6 w-6 text-yellow-500" />;
      default:
        return <Shield className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return 'border-muted';
      case 'pro':
        return 'border-primary';
      case 'business':
        return 'border-yellow-500';
      default:
        return 'border-muted';
    }
  };

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    try {
      // TODO: Implement Stripe integration
      toast.info('Stripe integration coming soon! This will redirect to checkout.');
      setShowUpgradeModal(false);
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to start subscription process');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentPlan = currentSubscription?.plan || plans.find(p => p.name === 'Free');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div ref={pageRef} className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription, billing information, and payment methods
          </p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getPlanIcon(currentPlan?.name || 'Free')}
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Current Plan: {currentPlan?.name}
                    {currentPlan?.name !== 'Free' && (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{currentPlan?.description}</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {currentPlan?.price_monthly === 0
                    ? 'Free'
                    : formatPrice(currentPlan?.price_monthly || 0)
                  }
                </div>
                {currentPlan?.price_monthly !== 0 && (
                  <div className="text-sm text-muted-foreground">per month</div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {currentPlan?.max_faqs === -1 ? '∞' : currentPlan?.max_faqs || 0}
                </div>
                <div className="text-sm text-muted-foreground">FAQs</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {currentPlan?.max_monthly_messages === -1 ? '∞' : currentPlan?.max_monthly_messages || 0}
                </div>
                <div className="text-sm text-muted-foreground">Monthly Messages</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {currentSubscription?.status || 'Free'}
                </div>
                <div className="text-sm text-muted-foreground">Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Period Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2">Save 20%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id;
            const price = billingPeriod === 'yearly' ? plan.price_yearly : plan.price_monthly;

            return (
              <Card
                key={plan.id}
                className={`relative ${getPlanColor(plan.name)} ${
                  plan.name === 'Pro' ? 'ring-2 ring-primary' : ''
                }`}
              >
                {plan.name === 'Pro' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-2">
                    {getPlanIcon(plan.name)}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">
                      {price === 0 ? 'Free' : formatPrice(price)}
                    </div>
                    {price !== 0 && (
                      <div className="text-sm text-muted-foreground">
                        per {billingPeriod === 'yearly' ? 'year' : 'month'}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>FAQs:</span>
                      <span className="font-medium">
                        {plan.max_faqs === -1 ? 'Unlimited' : plan.max_faqs}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Messages:</span>
                      <span className="font-medium">
                        {plan.max_monthly_messages === -1 ? 'Unlimited' : plan.max_monthly_messages}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? 'outline' : 'default'}
                    onClick={() => !isCurrentPlan && handleUpgrade(plan)}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeadphonesIcon className="h-5 w-5" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Need help with your subscription or billing? Our support team is here to help.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download your invoices and view your billing history.
              </p>
              <Button variant="outline" className="w-full">
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to {selectedPlan?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {selectedPlan?.price_monthly === 0
                  ? 'Free'
                  : formatPrice(billingPeriod === 'yearly'
                    ? selectedPlan?.price_yearly || 0
                    : selectedPlan?.price_monthly || 0
                  )
                }
              </div>
              <div className="text-sm text-muted-foreground">
                per {billingPeriod === 'yearly' ? 'year' : 'month'}
              </div>
            </div>

            <div className="space-y-2">
              {selectedPlan?.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowUpgradeModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubscribe} className="flex-1">
                Subscribe Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;