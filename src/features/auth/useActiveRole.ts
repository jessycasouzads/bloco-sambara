import { useAuth } from './useAuth';
import { useRoleStore, type ActiveRole } from '@/stores/roleStore';

interface ActiveRoleResult {
  /** Rol con el que se renderiza la UI. */
  active: ActiveRole;
  /** Rol "real" del usuario en la base. */
  real: 'teacher' | 'student' | 'both' | null;
  /** Si el usuario puede legítimamente cambiar de rol (rol = 'both'). */
  canSwitch: boolean;
  /** Si hay override manual activo (modo prueba). */
  isOverridden: boolean;
}

export function useActiveRole(): ActiveRoleResult {
  const { profile } = useAuth();
  const override = useRoleStore(s => s.override);

  const real = profile?.role ?? null;
  const canSwitch = real === 'both';

  let active: ActiveRole;
  if (override) {
    active = override;
  } else if (real === 'teacher' || real === 'both') {
    active = 'teacher';
  } else {
    active = 'student';
  }

  return { active, real, canSwitch, isOverridden: override !== null };
}
