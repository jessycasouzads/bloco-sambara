import { Music } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageContent } from '@/components/layout/PageContent';

export function MediaPage() {
  return (
    <div>
      <PageHeader title="Multimedia" subtitle="Videos, audios y partituras" />
      <PageContent>
        <EmptyState
          icon={<Music className="h-7 w-7" />}
          title="Próximamente"
          description="Carpetas con videos, audios y PDFs según el nivel."
        />
      </PageContent>
    </div>
  );
}
