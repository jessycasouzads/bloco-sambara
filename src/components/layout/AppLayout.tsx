import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="min-h-full bg-cream lg:flex">
      <Sidebar className="hidden lg:flex" />

      <div className="mx-auto flex w-full max-w-md flex-col lg:mx-0 lg:max-w-none lg:flex-1">
        <main className="flex-1 pb-24 lg:pb-12">
          <Outlet />
        </main>
        <TabBar className="lg:hidden" />
      </div>
    </div>
  );
}
