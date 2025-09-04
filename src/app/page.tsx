'use client'

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Upload,
  Zap,
  Shield,
  BarChart3,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Index = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const features = [
    {
      icon: MessageSquare,
      title: "Smart AI Responses",
      description: "AI learns from your knowledge base to provide accurate, contextual answers to customer questions."
    },
    {
      icon: Upload,
      title: "Easy Setup",
      description: "Upload your FAQs and documentation in minutes. No technical expertise required."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Your AI assistant is always ready to help customers, reducing response times to seconds."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track performance, popular questions, and customer satisfaction metrics."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security ensures your data and customer interactions stay protected."
    },
    {
      icon: Zap,
      title: "Instant Integration",
      description: "Embed in your website with a single line of code. Works with any platform."
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Upload Your FAQs",
      description: "Import your existing knowledge base or create new FAQs in our intuitive editor."
    },
    {
      step: "2",
      title: "AI Trains Automatically",
      description: "Our AI analyzes your content and learns to answer questions in your brand voice."
    },
    {
      step: "3",
      title: "Customers Get Instant Answers",
      description: "Deploy the chatbot and start providing 24/7 customer support immediately."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Customer Success Manager",
      company: "TechStart Inc.",
      content: "Reduced our support tickets by 70% in the first month. The AI understands context perfectly.",
      avatar: "SC"
    },
    {
      name: "Mike Rodriguez",
      role: "Founder",
      company: "E-commerce Plus",
      content: "Setup took less than 10 minutes. Our customers love getting instant answers at any time.",
      avatar: "MR"
    },
    {
      name: "Lisa Wang",
      role: "Operations Director",
      company: "SaaS Solutions",
      content: "The analytics help us understand what customers really need. It's like having a research tool.",
      avatar: "LW"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out the platform",
      features: ["Up to 50 FAQs", "100 messages/month", "Basic analytics", "Email support"],
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For growing businesses",
      features: ["Unlimited FAQs", "5,000 messages/month", "Advanced analytics", "Priority support", "Custom branding"],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations",
      features: ["Everything in Pro", "Unlimited messages", "Custom integrations", "Dedicated support", "SLA guarantee"],
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I use this without any coding knowledge?",
      answer: "Absolutely! Our platform is designed for non-technical users. Simply upload your content and embed with one line of code."
    },
    {
      question: "How accurate are the AI responses?",
      answer: "Our AI achieves 95%+ accuracy by training specifically on your content. It gets smarter with each interaction."
    },
    {
      question: "Can I customize the chatbot appearance?",
      answer: "Yes! Pro and Enterprise plans include full customization options to match your brand colors and style."
    },
    {
      question: "Is my data secure?",
      answer: "We use enterprise-grade encryption and never share your data. All conversations are private and secure."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="ml-2 text-xl font-bold">AI FAQ Assistant</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="hover:text-primary transition-colors">Features</a>
                <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                <a href="#demo" className="hover:text-primary transition-colors">Demo</a>
                <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/auth')}>Sign In</Button>
              <Button onClick={() => router.push('/auth')}>Get Started</Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <a href="#features" className="block px-3 py-2 hover:bg-accent rounded-md">Features</a>
              <a href="#pricing" className="block px-3 py-2 hover:bg-accent rounded-md">Pricing</a>
              <a href="#demo" className="block px-3 py-2 hover:bg-accent rounded-md">Demo</a>
              <a href="#faq" className="block px-3 py-2 hover:bg-accent rounded-md">FAQ</a>
              <div className="px-3 py-2 space-y-2">
                <Button variant="ghost" className="w-full" onClick={() => router.push('/auth')}>Sign In</Button>
                <Button className="w-full" onClick={() => router.push('/auth')}>Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6">
              ✨ Reduce support costs by up to 80%
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AI-Powered FAQ Assistant for Your Business
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Answer customer questions instantly, reduce support costs, and improve satisfaction with intelligent AI responses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" onClick={() => router.push('/auth')} className="text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>

            {/* Hero Visual Placeholder */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border">
                <div className="bg-card rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-left space-y-4">
                    <div className="bg-primary/10 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">👋 Hi! How can I help you today?</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3 max-w-xs ml-auto">
                      <p className="text-sm">What's your refund policy?</p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3 max-w-sm">
                      <p className="text-sm">We offer a 30-day money-back guarantee on all plans. You can request a refund anytime within 30 days of purchase, no questions asked.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground mb-8">
            Trusted by startups and growing businesses worldwide
          </p>
          <div className="flex justify-center items-center space-x-12 opacity-50">
            <div className="text-2xl font-bold">TechStart</div>
            <div className="text-2xl font-bold">E-commerce+</div>
            <div className="text-2xl font-bold">SaaS Solutions</div>
            <div className="text-2xl font-bold">InnovateCorp</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to provide exceptional customer support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Try our interactive demo to see how your customers will experience instant support
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="text-center mb-6">
                <Badge variant="outline">Interactive Demo</Badge>
              </div>
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-4 max-w-sm">
                  <p className="text-sm">👋 Hello! I'm your AI assistant. Ask me anything about our service!</p>
                </div>
                <div className="bg-muted rounded-lg p-4 max-w-sm ml-auto">
                  <p className="text-sm">How do I cancel my subscription?</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4 max-w-lg">
                  <p className="text-sm">You can cancel your subscription anytime from your account settings. Go to Billing → Manage Subscription → Cancel. You'll retain access until your current billing period ends.</p>
                </div>
                <div className="text-center pt-4">
                  <Button onClick={() => router.push('/auth')}>
                    Try It For Free
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => router.push('/auth')}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of businesses improving their customer support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our AI FAQ Assistant
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Button variant="outline" onClick={() => router.push('/auth')}>
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="ml-2 text-xl font-bold">AI FAQ Assistant</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Intelligent customer support for modern businesses.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
                <li><a href="#demo" className="hover:text-primary">Demo</a></li>
                <li><a href="/docs" className="hover:text-primary">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/about" className="hover:text-primary">About</a></li>
                <li><a href="/blog" className="hover:text-primary">Blog</a></li>
                <li><a href="/careers" className="hover:text-primary">Careers</a></li>
                <li><a href="/contact" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="/security" className="hover:text-primary">Security</a></li>
                <li><a href="/cookies" className="hover:text-primary">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AI FAQ Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
