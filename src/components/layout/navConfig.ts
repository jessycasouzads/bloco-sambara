import { Calendar, Home, Music, Sparkles, User as UserIcon, Users } from 'lucide-react';
import type { ActiveRole } from '@/stores/roleStore';

export interface NavItem {
  to: string;
  label: string;
  Icon: typeof Home;
}

const teacherNav: NavItem[] = [
  { to: '/', label: 'Inicio', Icon: Home },
  { to: '/alumnos', label: 'Alumnos', Icon: Users },
  { to: '/clases', label: 'Clases', Icon: Calendar },
  { to: '/eventos', label: 'Eventos', Icon: Sparkles },
  { to: '/multimedia', label: 'Media', Icon: Music },
  { to: '/cuenta', label: 'Cuenta', Icon: UserIcon },
];

const studentNav: NavItem[] = [
  { to: '/', label: 'Inicio', Icon: Home },
  { to: '/clases', label: 'Mis clases', Icon: Calendar },
  { to: '/multimedia', label: 'Media', Icon: Music },
  { to: '/eventos', label: 'Eventos', Icon: Sparkles },
  { to: '/cuenta', label: 'Cuenta', Icon: UserIcon },
];

export function getNavItems(role: ActiveRole): NavItem[] {
  return role === 'teacher' ? teacherNav : studentNav;
}

/** Para la TabBar mobile: solo 5 items principales. */
export function getTabBarItems(role: ActiveRole): NavItem[] {
  return getNavItems(role).slice(0, 5);
}
