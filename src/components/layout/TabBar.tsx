import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { useActiveRole } from '@/features/auth/useActiveRole';
import { getTabBarItems } from './navConfig';

export function TabBar({ className }: { className?: string }) {
  const { active } = useActiveRole();
  const items = getTabBarItems(active);

  return (
    <nav
      className={cn(
        'safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-parchment bg-white/95 backdrop-blur',
        className,
      )}
      aria-label="Navegación principal"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors',
                  isActive ? 'text-brand-600' : 'text-ink/50 hover:text-ink/80',
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
  );
}
