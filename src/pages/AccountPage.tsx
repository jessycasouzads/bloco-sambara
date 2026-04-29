import { LogOut, GraduationCap, UserCog } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { PageContent } from '@/components/layout/PageContent';
import { useAuth } from '@/features/auth/AuthProvider';
import { useActiveRole } from '@/features/auth/useActiveRole';
import { useRoleStore } from '@/stores/roleStore';
import { cn } from '@/lib/cn';

export function AccountPage() {
  const { profile, user, signOut } = useAuth();
  const { active, real, isOverridden } = useActiveRole();
  const setOverride = useRoleStore(s => s.setOverride);

  const name = profile?.name ?? user?.email ?? 'Tu cuenta';

  return (
    <div>
      <PageHeader title="Mi cuenta" />

      <PageContent className="space-y-4">
        <Card className="flex items-center gap-4 p-4">
          <Avatar name={name} src={profile?.avatar_url} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold text-ink">{name}</p>
            <p className="truncate text-sm text-ink/60">{user?.email}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="brand">{active === 'teacher' ? 'Profesor' : 'Alumno'}</Pill>
              {profile?.level && <Pill tone="neutral">Nivel {profile.level}</Pill>}
              {isOverridden && <Pill tone="warning">Modo prueba</Pill>}
            </div>
          </div>
        </Card>

        {/* Toggle de rol — modo prueba */}
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <UserCog className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-semibold text-ink">Modo de prueba</p>
              <p className="mt-0.5 text-sm text-ink/60">
                Cambiá la vista entre profe y alumno. Solo afecta lo que ves — los permisos reales
                los hace cumplir el servidor.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <RoleButton
              label="Alumno"
              icon={<GraduationCap className="h-4 w-4" />}
              selected={active === 'student'}
              onClick={() => setOverride('student')}
            />
            <RoleButton
              label="Profesor"
              icon={<UserCog className="h-4 w-4" />}
              selected={active === 'teacher'}
              onClick={() => setOverride('teacher')}
            />
          </div>

          {isOverridden && (
            <button
              type="button"
              onClick={() => setOverride(null)}
              className="mt-3 w-full text-center text-xs font-semibold text-brand-700 hover:underline"
            >
              Volver a mi rol real ({real === 'both' ? 'profe + alumno' : real})
            </button>
          )}
        </Card>

        <Button
          variant="ghost"
          leftIcon={<LogOut className="h-4 w-4" />}
          onClick={signOut}
          fullWidth
        >
          Cerrar sesión
        </Button>
      </PageContent>
    </div>
  );
}

function RoleButton({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors',
        selected
          ? 'bg-brand-600 text-white shadow-card'
          : 'bg-brand-50 text-brand-700 hover:bg-brand-100',
      )}
    >
      {icon}
      {label}
    </button>
  );
}
