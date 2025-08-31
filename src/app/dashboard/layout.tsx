import DashboardHeader from '@/components/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black cyber-grid">
      <DashboardHeader />
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
