import { AppSidebar } from '@/components/admin/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { getCurrentUser } from '@/lib/actions/auth/me';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const metadata = {
  title: 'Ascencio Tax Inc - Admin Portal',
  description: 'Administration portal for Ascencio Tax Inc services',
};

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'es');
  const user = await getCurrentUser();
  if (!user) {
    // opcional: redirigir a signin o mostrar placeholder
    return <div>Necesitas iniciar sesión</div>;
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} dict={dict} variant="inset" />

      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
