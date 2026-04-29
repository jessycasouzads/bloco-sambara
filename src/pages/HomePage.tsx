import { Bell } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { PageContent } from '@/components/layout/PageContent';
import { useAuth } from '@/features/auth/AuthProvider';
import { useActiveRole } from '@/features/auth/useActiveRole';
import { useTenant } from '@/features/tenant/TenantProvider';

export function HomePage() {
  const { profile } = useAuth();
  const { active, isOverridden } = useActiveRole();
  const { tenant } = useTenant();
  const name = profile?.name ?? 'Hola';
  const isTeacher = active === 'teacher';

  return (
    <div>
      <PageHeader
        title={`¡Hola, ${name.split(' ')[0]}!`}
        subtitle={tenant?.name ?? 'Bloco Sambará'}
        right={
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
          </button>
        }
      />

      <PageContent>
        <Card className="flex items-center gap-4 p-4">
          <Avatar name={name} src={profile?.avatar_url} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold text-ink">{name}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Pill tone="brand">{isTeacher ? 'Profesor' : 'Alumno'}</Pill>
              {profile?.level && <Pill tone="neutral">{profile.level}</Pill>}
              {profile?.status === 'pending' && <Pill tone="warning">Pendiente</Pill>}
              {isOverridden && <Pill tone="warning">Modo prueba</Pill>}
            </div>
          </div>
        </Card>

        <h2 className="mt-7 mb-3 font-display text-xl font-semibold text-ink">
          {isTeacher ? 'Hoy en la escuela' : 'Tu próxima clase'}
        </h2>
        <Card className="p-5">
          <p className="text-sm text-ink/60">
            Estamos preparando este módulo. Las pantallas funcionales llegan en la siguiente fase.
          </p>
        </Card>
      </PageContent>
    </div>
  );
}
