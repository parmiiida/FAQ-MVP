'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import gsap from 'gsap';
import StatCard from '@/components/cards/StatCard';
import AssistantsCard from '@/components/cards/AssistantsCard';
import KnowledgeBaseCard from '@/components/cards/KnowledgeBase';
import { Bot, MessageSquare, Users, BarChart3, TrendingUp, Clock, Plus } from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assistants: 0,
    faqs: 0,
    conversations: 0,
    recentChats: 0,
  });
  const [recentAssistants, setRecentAssistants] = useState<{ id: string; name: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gsap.fromTo(
      '.stat-card',
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      },
    );

    gsap.fromTo(
      '.welcome-section',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
    );

    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch assistants count
      const { data: assistants, error: assistantsError } = await supabase
        .from('assistants')
        .select('id, name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (assistantsError) throw assistantsError;

      // Fetch FAQs count across all user's assistants
      const assistantIds = assistants?.map((a) => a.id) || [];
      let faqsCount = 0;
      if (assistantIds.length > 0) {
        const { count: faqCount, error: faqsError } = await supabase
          .from('faqs')
          .select('id', { count: 'exact' })
          .in('assistant_id', assistantIds);

        if (faqsError) throw faqsError;
        faqsCount = faqCount || 0;
      }

      // Fetch chat sessions count
      let conversationsCount = 0;
      if (assistantIds.length > 0) {
        const { count: chatCount, error: chatError } = await supabase
          .from('chat_sessions')
          .select('id', { count: 'exact' })
          .in('assistant_id', assistantIds);

        if (chatError) throw chatError;
        conversationsCount = chatCount || 0;
      }

      // Fetch recent chat sessions count (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      let recentChatsCount = 0;
      if (assistantIds.length > 0) {
        const { count: recentCount, error: recentError } = await supabase
          .from('chat_sessions')
          .select('id', { count: 'exact' })
          .in('assistant_id', assistantIds)
          .gte('started_at', weekAgo.toISOString());

        if (recentError) throw recentError;
        recentChatsCount = recentCount || 0;
      }

      setStats({
        assistants: assistants?.length || 0,
        faqs: faqsCount,
        conversations: conversationsCount,
        recentChats: recentChatsCount,
      });

      setRecentAssistants(assistants?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.user_metadata?.name || user?.email}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your AI assistants, FAQs, and analytics from your dashboard.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Assistants"
          value={loading ? '...' : stats.assistants}
          description={
            stats.assistants === 0 ? (
              <>
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Ready to create your first
              </>
            ) : (
              <>
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {stats.assistants === 1 ? 'assistant' : 'assistants'} created
              </>
            )
          }
          icon={Bot}
          route="/dashboard/assistants"
        />
        <StatCard
          title="Total FAQs"
          value={loading ? '...' : stats.faqs}
          description={
            stats.faqs === 0 ? (
              <>
                <Plus className="w-3 h-3 inline mr-1" />
                Add your first FAQ
              </>
            ) : (
              <>
                <MessageSquare className="w-3 h-3 inline mr-1" />
                {stats.faqs === 1 ? 'FAQ' : 'FAQs'} available
              </>
            )
          }
          icon={MessageSquare}
          route="/dashboard/faq"
        />
        <StatCard
          title="Conversations"
          value={loading ? '...' : stats.conversations}
          description={
            stats.conversations === 0 ? (
              <>
                <Clock className="w-3 h-3 inline mr-1" />
                Start chatting today
              </>
            ) : (
              <>
                <Users className="w-3 h-3 inline mr-1" />
                {stats.recentChats} recent chats
              </>
            )
          }
          icon={Users}
          route="/dashboard/chat"
        />
        <StatCard
          title="Analytics"
          value="View"
          description={
            <>
              <BarChart3 className="w-3 h-3 inline mr-1" />
              Track performance
            </>
          }
          icon={BarChart3}
          route="/dashboard/analytics"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssistantsCard assistantsCount={stats.assistants} recentAssistants={recentAssistants} />
        <KnowledgeBaseCard faqsCount={stats.faqs} assistantsCount={stats.assistants} />
      </div>
    </div>
  );
};

export default DashboardHome;