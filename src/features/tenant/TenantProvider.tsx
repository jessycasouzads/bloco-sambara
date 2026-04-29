import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tenant, BrandColors, BrandShade } from '@/types/database';
import { TenantContext } from './tenantContext';

const DEFAULT_BRAND: BrandColors = {
  50: '253 242 248',
  100: '252 231 243',
  200: '251 207 232',
  300: '249 168 212',
  400: '232 121 173',
  500: '194 57 140',
  600: '168 40 118',
  700: '138 31 96',
  800: '111 26 77',
  900: '90 22 62',
};

const SHADES: readonly BrandShade[] = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
];

function applyBrandColors(colors: BrandColors) {
  const root = document.documentElement;
  for (const shade of SHADES) {
    root.style.setProperty(`--brand-${shade}`, colors[shade]);
  }
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const slug = import.meta.env.VITE_DEFAULT_TENANT_SLUG;

    (async () => {
      const { data, error: queryError } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .maybeSingle<Tenant>();

      if (cancelled) return;

      if (queryError) {
        setError(queryError.message);
        setLoading(false);
        return;
      }

      if (data) {
        setTenant(data);
        applyBrandColors(data.brand_colors ?? DEFAULT_BRAND);
      } else {
        applyBrandColors(DEFAULT_BRAND);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ tenant, loading, error }), [tenant, loading, error]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}
