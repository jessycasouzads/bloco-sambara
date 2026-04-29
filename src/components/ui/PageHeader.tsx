import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, right, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'safe-top bg-brand-gradient text-white shadow-card',
        'rounded-b-[28px] px-5 pt-6 pb-7 lg:rounded-b-[32px] lg:px-8 lg:pt-10 lg:pb-10',
        className,
      )}
    >
      <div className="lg:mx-auto lg:max-w-4xl">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-semibold leading-tight lg:text-4xl">
              {title}
            </h1>
            {subtitle && <p className="mt-1 text-sm text-white/80 lg:text-base">{subtitle}</p>}
          </div>
          {right && <div className="flex-shrink-0">{right}</div>}
        </div>
      </div>
    </header>
  );
}
