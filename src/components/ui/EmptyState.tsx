import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-xs text-sm text-ink/60">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
