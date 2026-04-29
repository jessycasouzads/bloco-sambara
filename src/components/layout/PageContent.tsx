import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Wrapper estándar para el contenido debajo del PageHeader.
 * En mobile usa todo el ancho, en desktop constrae a max-w-4xl centrado.
 */
export function PageContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-5 pt-6 lg:mx-auto lg:max-w-4xl lg:px-8 lg:pt-8', className)}>
      {children}
    </div>
  );
}
