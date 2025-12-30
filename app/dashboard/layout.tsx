// app/dashboard/layout.tsx
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "MjolnirUI Pro • Dashboard",
  description: "Welcome to the Asgardian Realm of MjolnirUI Pro!",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Permanent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Header />
        
        {/* Page Content with subtle gradient */}
        <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-zinc-950/50 via-black to-zinc-950/50">
          {children}
        </main>
      </div>

      <Toaster position="bottom-right" richColors theme="dark" />
    </div>
  );
}