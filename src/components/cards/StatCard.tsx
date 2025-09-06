'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string | React.ReactNode;
  icon: LucideIcon;
  route: string;
}

const StatCard = ({ title, value, description, icon: Icon, route }: StatCardProps) => {
  const router = useRouter();

  const handleCardHover = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1.02,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleCardLeave = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  return (
    <Card
      className="stat-card cursor-pointer hover:shadow-lg transition-shadow"
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}
      onClick={() => router.push(route)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;