import { Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageContent } from '@/components/layout/PageContent';

export function StudentsPage() {
  return (
    <div>
      <PageHeader title="Alumnos" subtitle="Gestión de la escuela" />
      <PageContent>
        <EmptyState
          icon={<Users className="h-7 w-7" />}
          title="Próximamente"
          description="Lista de alumnos con filtros, búsqueda y fichas individuales."
        />
      </PageContent>
    </div>
  );
}
