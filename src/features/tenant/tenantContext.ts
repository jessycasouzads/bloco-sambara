import { createContext } from 'react';
import type { Tenant } from '@/types/database';

export interface TenantContextValue {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

export const TenantContext = createContext<TenantContextValue | undefined>(undefined);
