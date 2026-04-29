import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ActiveRole = 'teacher' | 'student';

interface RoleState {
  /** Override solo afecta la UI. Los permisos reales los hace cumplir RLS en la DB. */
  override: ActiveRole | null;
  setOverride: (role: ActiveRole | null) => void;
  toggleOverride: () => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      override: null,
      setOverride: role => set({ override: role }),
      toggleOverride: () => {
        const current = get().override ?? 'student';
        set({ override: current === 'teacher' ? 'student' : 'teacher' });
      },
    }),
    { name: 'sambara-role-override' },
  ),
);
