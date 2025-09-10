"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Key,
  Trash2,
  Save,
  Bot,
  Database,
  CreditCard,
  Download,
  Upload,
  Github,
  Chrome,
  AlertTriangle,
  Settings,
  Zap,
  Brain,
  MessageSquare,
  History,
  Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import gsap from "gsap";

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    role: "user" as "user" | "admin",
    avatar: "",
    username: "",
  });
  const [aiPreferences, setAiPreferences] = useState({
    defaultModel: "gpt-4o",
    responseStyle: "balanced",
    language: "en",
    temperature: [0.7],
    safeMode: true,
    maxTokens: 1000,
  });
  const [dataSettings, setDataSettings] = useState({
    saveHistory: true,
    autoExport: false,
    retentionDays: 30,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklyReport: true,
    featureUpdates: true,
    securityAlerts: true,
  });
  const [billingInfo, setBillingInfo] = useState({
    plan: "Free",
    tokensUsed: 1250,
    tokensLimit: 5000,
    requestsUsed: 42,
    requestsLimit: 100,
  });

  useEffect(() => {
    gsap.fromTo(
      ".settings-section",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          name: data.name || "",
          role: data.role,
          avatar: "",
          username: "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    // This would typically open a modal or redirect to a password change form
    toast({
      title: "Password Change",
      description: "Password change functionality will be implemented here.",
    });
  };

  const saveAiPreferences = async () => {
    setLoading(true);
    try {
      toast({
        title: "AI Preferences saved",
        description: "Your AI assistant preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save AI preferences.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    setLoading(true);
    try {
      // Simulate data export
      const data = {
        profile,
        conversations: [],
        preferences: aiPreferences,
        exportDate: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-assistant-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    toast({
      title: "Clear All Data",
      description:
        "This will permanently delete all your conversations and data.",
      variant: "destructive",
    });
  };

  const deleteAccount = async () => {
    toast({
      title: "Account Deletion",
      description: "Account deletion requires additional confirmation steps.",
      variant: "destructive",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
      {/* Header */}

      <Card className="settings-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="w-5 h-5" />
            🔐 Account Settings
          </CardTitle>
          <CardDescription>
            Manage your profile information and account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>
                  {profile.name
                    ? profile.name.charAt(0).toUpperCase()
                    : user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Avatar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username/Handle</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={profile.role}
                  disabled
                  className="bg-muted capitalize"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Security Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Security & Privacy</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4" />
                  <div>
                    <span className="font-medium">Password</span>
                    <p className="text-sm text-muted-foreground">
                      Change your account password
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={changePassword}>
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Chrome className="w-4 h-4" />
                  <div>
                    <span className="font-medium">Google Account</span>
                    <p className="text-sm text-muted-foreground">
                      Connect your Google account
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Github className="w-4 h-4" />
                  <div>
                    <span className="font-medium">GitHub Account</span>
                    <p className="text-sm text-muted-foreground">
                      Connect your GitHub account
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={updateProfile}
            disabled={loading}
            className="w-full md:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Account Settings"}
          </Button>
        </CardContent>
      </Card>

      {/* 🎛️ AI Assistant Preferences */}
      <Card className="settings-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="w-5 h-5" />
            🎛️ AI Assistant Preferences
          </CardTitle>
          <CardDescription>
            Customize your AI assistant's behavior and responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Default Model</Label>
              <Select
                value={aiPreferences.defaultModel}
                onValueChange={(value) =>
                  setAiPreferences({ ...aiPreferences, defaultModel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o (Premium)</SelectItem>
                  <SelectItem value="gpt-4o-mini">
                    GPT-4o Mini (Fast)
                  </SelectItem>
                  <SelectItem value="claude-3-sonnet">
                    Claude 3 Sonnet
                  </SelectItem>
                  <SelectItem value="claude-3-haiku">
                    Claude 3 Haiku (Free)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Response Style</Label>
              <Select
                value={aiPreferences.responseStyle}
                onValueChange={(value) =>
                  setAiPreferences({ ...aiPreferences, responseStyle: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Language</Label>
              <Select
                value={aiPreferences.language}
                onValueChange={(value) =>
                  setAiPreferences({ ...aiPreferences, language: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Max Tokens</Label>
              <Select
                value={aiPreferences.maxTokens.toString()}
                onValueChange={(value) =>
                  setAiPreferences({
                    ...aiPreferences,
                    maxTokens: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">500 tokens</SelectItem>
                  <SelectItem value="1000">1,000 tokens</SelectItem>
                  <SelectItem value="2000">2,000 tokens</SelectItem>
                  <SelectItem value="4000">4,000 tokens</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label>
                Temperature / Creativity: {aiPreferences.temperature[0]}
              </Label>
              <Slider
                value={aiPreferences.temperature}
                onValueChange={(value) =>
                  setAiPreferences({ ...aiPreferences, temperature: value })
                }
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Focused (0.0)</span>
                <span>Balanced (1.0)</span>
                <span>Creative (2.0)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Safe Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable content filtering and safety guidelines
              </p>
            </div>
            <Switch
              checked={aiPreferences.safeMode}
              onCheckedChange={(checked) =>
                setAiPreferences({ ...aiPreferences, safeMode: checked })
              }
            />
          </div>

          <Button
            onClick={saveAiPreferences}
            disabled={loading}
            className="w-full md:w-auto"
          >
            <Brain className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save AI Preferences"}
          </Button>
        </CardContent>
      </Card>

      {/* 💾 Data & History */}
      <Card className="settings-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="w-5 h-5" />
            💾 Data & History
          </CardTitle>
          <CardDescription>
            Manage your conversation history and data preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Save Chat History</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save your conversations for future reference
                </p>
              </div>
              <Switch
                checked={dataSettings.saveHistory}
                onCheckedChange={(checked) =>
                  setDataSettings({ ...dataSettings, saveHistory: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Export</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically export conversations monthly
                </p>
              </div>
              <Switch
                checked={dataSettings.autoExport}
                onCheckedChange={(checked) =>
                  setDataSettings({ ...dataSettings, autoExport: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Data Retention (Days)</Label>
              <Select
                value={dataSettings.retentionDays.toString()}
                onValueChange={(value) =>
                  setDataSettings({
                    ...dataSettings,
                    retentionDays: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="-1">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-medium">Data Management</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={exportData} disabled={loading}>
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
              <Button variant="outline" disabled={loading}>
                <History className="w-4 h-4 mr-2" />
                View Chat History
              </Button>
              <Button
                variant="destructive"
                onClick={clearAllData}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🔔 Notifications */}
      <Card className="settings-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5" />
            🔔 Notifications
          </CardTitle>
          <CardDescription>
            Configure how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive important updates via email
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, email: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, push: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Activity Report</Label>
                <p className="text-sm text-muted-foreground">
                  Get a summary of your AI assistant usage
                </p>
              </div>
              <Switch
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, weeklyReport: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Feature Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Be notified about new features and improvements
                </p>
              </div>
              <Switch
                checked={notifications.featureUpdates}
                onCheckedChange={(checked) =>
                  setNotifications({
                    ...notifications,
                    featureUpdates: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Security Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Important security notifications (recommended)
                </p>
              </div>
              <Switch
                checked={notifications.securityAlerts}
                onCheckedChange={(checked) =>
                  setNotifications({
                    ...notifications,
                    securityAlerts: checked,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 💳 Billing */}
      <Card className="settings-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="w-5 h-5" />
            💳 Billing & Usage
          </CardTitle>
          <CardDescription>
            Manage your subscription and monitor usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Current Plan</Label>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    billingInfo.plan === "Free" ? "secondary" : "default"
                  }
                >
                  {billingInfo.plan}
                </Badge>
                {billingInfo.plan === "Free" && (
                  <Button size="sm" variant="outline">
                    <Zap className="w-3 h-3 mr-1" />
                    Upgrade
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tokens Used</Label>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{billingInfo.tokensUsed.toLocaleString()}</span>
                  <span className="text-muted-foreground">
                    / {billingInfo.tokensLimit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        (billingInfo.tokensUsed / billingInfo.tokensLimit) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Requests Used</Label>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{billingInfo.requestsUsed}</span>
                  <span className="text-muted-foreground">
                    / {billingInfo.requestsLimit}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        (billingInfo.requestsUsed / billingInfo.requestsLimit) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            {billingInfo.plan === "Free" && (
              <Button>
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="settings-section border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
            <div className="space-y-1">
              <span className="font-medium">Delete Account</span>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data (GDPR
                compliant)
              </p>
            </div>
            <Button variant="destructive" onClick={deleteAccount}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
