import { LandingNavbar } from '@/components/landing/landing-navbar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>{children}</main>
    </div>
  );
}
