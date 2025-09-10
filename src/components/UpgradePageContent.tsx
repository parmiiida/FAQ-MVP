"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check, CreditCard, Shield, Crown, Zap } from "lucide-react";
import gsap from "gsap";

const UpgradePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const plan = searchParams.get("plan")
    ? JSON.parse(searchParams.get("plan") as string)
    : null;

  useEffect(() => {
    gsap.fromTo(
      ".upgrade-content",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  if (!plan) {
    router.push("/dashboard/billing");
    return null;
  }

  const handleUpgrade = () => {
    console.log("Upgrading to:", plan.name);
    alert(`Upgrading to ${plan.name} plan!`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 upgrade-content">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/billing")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Billing
        </Button>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Upgrade Your Plan
        </h1>
        <p className="text-muted-foreground">
          You're about to upgrade to the {plan.name} plan
        </p>
      </div>

      {/* Plan Summary */}
      <Card className="border-2 border-primary">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            {plan.popular && <Crown className="w-6 h-6 text-primary" />}
          </div>
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          <div className="text-3xl font-bold">
            ${plan.price}
            <span className="text-lg font-normal text-muted-foreground">
              /{plan.period}
            </span>
          </div>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-semibold mb-3">What's included:</h4>
            <ul className="space-y-2">
              {plan.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>{plan.name} Plan</span>
            <span className="font-semibold">
              ${plan.price}/{plan.period}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Tax (if applicable)</span>
            <span>Calculated at checkout</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center font-semibold">
            <span>Total</span>
            <span>
              ${plan.price}/{plan.period}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-muted/50">
        <CardContent className="flex items-center gap-3 p-4">
          <Shield className="w-5 h-5 text-green-500" />
          <div className="text-sm">
            <p className="font-medium">Secure Payment</p>
            <p className="text-muted-foreground">
              Your payment information is encrypted and secure. You can cancel
              anytime.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push("/dashboard/billing")}
        >
          Cancel
        </Button>
        <Button className="flex-1 group" onClick={handleUpgrade}>
          <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
          Upgrade to {plan.name}
        </Button>
      </div>

      {/* Terms */}
      <p className="text-xs text-muted-foreground text-center">
        By proceeding, you agree to our{" "}
        <a href="#" className="underline hover:text-foreground">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-foreground">
          Privacy Policy
        </a>
        . You can cancel your subscription at any time.
      </p>
    </div>
  );
};

export default UpgradePageContent;
