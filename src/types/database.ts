/**
 * Tipos de la base de datos.
 * Cuando estabilicemos el schema, regenerar con:
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.ts
 *
 * Por ahora mantenemos un esqueleto manual que matchea las migraciones SQL.
 */

export type Level = 'iniciacion' | 'intermedio' | 'bloco';
export type UserRole = 'teacher' | 'student' | 'both';
export type UserStatus = 'active' | 'pending' | 'inactive';

export type BrandShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type BrandColors = Record<BrandShade, string>;

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  brand_colors: BrandColors | null;
  config: Record<string, unknown> | null;
  created_at: string;
}

export interface Profile {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  level: Level | null;
  status: UserStatus;
  join_date: string;
  created_at: string;
}

interface TenantInsert {
  id?: string;
  slug: string;
  name: string;
  logo_url?: string | null;
  brand_colors?: BrandColors | null;
  config?: Record<string, unknown> | null;
  created_at?: string;
}

interface ProfileInsert {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatar_url?: string | null;
  role?: UserRole;
  level?: Level | null;
  status?: UserStatus;
  join_date?: string;
  created_at?: string;
}

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: Tenant;
        Insert: TenantInsert;
        Update: Partial<TenantInsert>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      user_status: UserStatus;
      level: Level;
    };
    CompositeTypes: Record<string, never>;
  };
}
