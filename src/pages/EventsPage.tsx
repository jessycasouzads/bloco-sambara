import { Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageContent } from '@/components/layout/PageContent';

export function EventsPage() {
  return (
    <div>
      <PageHeader title="Eventos" />
      <PageContent>
        <EmptyState
          icon={<Sparkles className="h-7 w-7" />}
          title="Próximamente"
          description="Shows, ensayos especiales y confirmación de asistencia."
        />
      </PageContent>
    </div>
  );
}
