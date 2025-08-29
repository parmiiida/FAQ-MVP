'use client'
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Index = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-3xl font-bold text-primary-foreground">AI</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          AI-Powered
          <span className="text-primary block">Business Assistant</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
          Transform your customer service with intelligent AI responses powered by your knowledge base.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => router.push('/auth')}
            className="text-lg px-8 py-6"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push('/auth')}
            className="text-lg px-8 py-6"
          >
            Sign In
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">Smart Responses</h3>
            <p className="text-sm text-muted-foreground">AI learns from your knowledge base to provide accurate answers</p>
          </div>
          <div className="p-6 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">Easy Setup</h3>
            <p className="text-sm text-muted-foreground">Upload your FAQs and start chatting in minutes</p>
          </div>
          <div className="p-6 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">24/7 Available</h3>
            <p className="text-sm text-muted-foreground">Your AI assistant is always ready to help</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
