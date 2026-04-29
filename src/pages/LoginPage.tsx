import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/features/auth/useAuth';
import { useTenant } from '@/features/tenant/useTenant';

export function LoginPage() {
  const { session, signIn } = useAuth();
  const { tenant } = useTenant();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setLoading(false);
    if (signInError) setError(signInError);
  }

  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden bg-brand-gradient px-5 py-12">
      <div className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center text-white">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
            <span className="font-display text-3xl font-semibold">BS</span>
          </div>
          <h1 className="font-display text-3xl font-semibold">{tenant?.name ?? 'Bloco Sambará'}</h1>
          <p className="mt-2 text-sm text-white/80">Entrá a tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-card bg-white p-6 shadow-card" noValidate>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
            <Input
              label="Contraseña"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-6">
            Entrar
          </Button>

          <p className="mt-4 text-center text-xs text-ink/50">
            ¿Olvidaste la contraseña? Pedí ayuda al profe.
          </p>
        </form>
      </div>
    </div>
  );
}
