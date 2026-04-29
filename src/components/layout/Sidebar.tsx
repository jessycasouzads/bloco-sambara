import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuth } from '@/features/auth/AuthProvider';
import { useActiveRole } from '@/features/auth/useActiveRole';
import { useTenant } from '@/features/tenant/TenantProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { getNavItems } from './navConfig';

export function Sidebar({ className }: { className?: string }) {
  const { profile, user, signOut } = useAuth();
  const { active, isOverridden } = useActiveRole();
  const { tenant } = useTenant();
  const items = getNavItems(active);
  const name = profile?.name ?? user?.email ?? 'Mi cuenta';

  return (
    <aside
      className={cn(
        'flex w-72 flex-shrink-0 flex-col border-r border-parchment bg-white',
        'h-screen sticky top-0',
        className,
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 pt-7 pb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient font-display text-lg font-semibold text-white shadow-card">
          BS
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-ink">
            {tenant?.name ?? 'Bloco Sambará'}
          </p>
          <p className="text-xs text-ink/50">Panel de gestión</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3" aria-label="Navegación principal">
        <ul className="space-y-1">
          {items.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink/70 hover:bg-parchment/50 hover:text-ink',
                  )
                }
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer: usuario + logout */}
      <div className="border-t border-parchment p-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar name={name} src={profile?.avatar_url} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <Pill tone="brand">{active === 'teacher' ? 'Profesor' : 'Alumno'}</Pill>
              {isOverridden && <Pill tone="warning">Modo prueba</Pill>}
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/50 hover:bg-parchment/50 hover:text-ink"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
