import { Calendar } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageContent } from '@/components/layout/PageContent';

export function ClassesPage() {
  return (
    <div>
      <PageHeader title="Clases" />
      <PageContent>
        <EmptyState
          icon={<Calendar className="h-7 w-7" />}
          title="Próximamente"
          description="Calendario de clases, pasar lista y recuperaciones."
        />
      </PageContent>
    </div>
  );
}
