'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import { Loader2 } from 'lucide-react';


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();

  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
        router.push('/dashboard');
    }
  }, [user]);

  useEffect(() => {
    // Initial animation
    if (cardRef.current && formRef.current) {
      gsap.set(cardRef.current, { opacity: 0, y: 30 });
      gsap.set(formRef.current.children, { opacity: 0, y: 20 });

      gsap.to(cardRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
      gsap.to(formRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.2,
        ease: 'power2.out'
      });
    }
  }, []);

  const handleModeSwitch = () => {
    if (formRef.current) {
      gsap.to(formRef.current.children, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        onComplete: () => {
          setIsLogin(!isLogin);
          gsap.fromTo(formRef.current!.children,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 }
          );
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (!isLogin) {
        toast({
          title: "Success",
          description: "Check your email to confirm your account",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card ref={cardRef} className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-foreground">AI</span>
            </div>
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? 'Welcome Back' : 'Sign Up'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
  {editingFAQId === faq.id ? (
    <div className="space-y-2">
      <Input
        value={editingQuestion}
        onChange={(e) => setEditingQuestion(e.target.value)}
        className="text-sm"
      />
      <textarea
        value={editingAnswer}
        onChange={(e) => setEditingAnswer(e.target.value)}
        className="w-full min-h-[60px] p-2 text-sm border rounded-md resize-none"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => handleSaveFAQ(faq.id)}>
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditingFAQId(null)}
        >
          Cancel
        </Button>
      </div>
    </div>
  ) : (
    <CardDescription className="text-xs leading-relaxed">
      {faq.answer}
    </CardDescription>
  )}
</CardContent>

      </Card>
    </div>
  );
};

export default Auth;