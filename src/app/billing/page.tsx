'use client'
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap } from 'lucide-react';
import { gsap } from 'gsap';

const Billing = () => {
  const { user } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current && cardsRef.current) {
      gsap.set([pageRef.current, cardsRef.current.children], { opacity: 0, y: 30 });

      gsap.to(pageRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' });
      gsap.to(cardsRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.2,
        ease: 'power2.out'
      });
    }
  }, []);

  const handleUpgrade = (plan: string) => {
    // Placeholder for Stripe integration
    console.log(`Upgrading to ${plan} plan`);
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '10 messages per day',
        'Basic AI responses',
        'Simple FAQ management',
        'Email support'
      ],
      current: true,
      buttonText: 'Current Plan',
      buttonDisabled: true
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For growing businesses',
      features: [
        'Unlimited messages',
        'Advanced AI responses',
        'Full KB management',
        'CSV/TXT uploads',
        'Priority support',
        'Custom AI training'
      ],
      current: false,
      buttonText: 'Upgrade to Pro',
      buttonDisabled: false,
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div ref={pageRef} className="max-w-6xl mx-auto px-4 py-8">
        {/* Current Plan Status */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Free Plan</p>
                  <p className="text-muted-foreground">7 messages remaining today</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Plans */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
            <p className="text-muted-foreground">Upgrade to unlock more features and capabilities</p>
          </div>

          <div ref={cardsRef} className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} hover:shadow-md transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.current ? "secondary" : "default"}
                    disabled={plan.buttonDisabled}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              Your recent transactions and invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No billing history available</p>
              <p className="text-sm mt-2">Upgrade to a paid plan to see your transactions here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;