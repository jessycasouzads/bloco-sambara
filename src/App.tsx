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

export default function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

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
