import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { TenantProvider } from '@/features/tenant/TenantProvider';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { HomePage } from '@/pages/HomePage';
import { StudentsPage } from '@/pages/StudentsPage';
import { ClassesPage } from '@/pages/ClassesPage';
import { EventsPage } from '@/pages/EventsPage';
import { MediaPage } from '@/pages/MediaPage';
import { AccountPage } from '@/pages/AccountPage';

// Scalar pesa ~300 KB — lazy load para no inflar el bundle principal
const ApiDocsPage = lazy(() => import('@/pages/ApiDocsPage'));

export default function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/api-docs"
            element={
              <Suspense fallback={<DocsLoadingFallback />}>
                <ApiDocsPage />
              </Suspense>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/alumnos" element={<StudentsPage />} />
            <Route path="/clases" element={<ClassesPage />} />
            <Route path="/eventos" element={<EventsPage />} />
            <Route path="/multimedia" element={<MediaPage />} />
            <Route path="/cuenta" element={<AccountPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </TenantProvider>
  );
}

function DocsLoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-cream">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    </div>
  );
}
