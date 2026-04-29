import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export function Card({ children, className, interactive, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card bg-white shadow-card',
        interactive && 'transition-shadow hover:shadow-card-hover cursor-pointer',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
