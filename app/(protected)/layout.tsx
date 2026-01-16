// app/(protected)/layout.tsx
"use client";

import { SidebarProvider } from "@/components/layout/SidebarContext";
import ClientLayout from "@/app/clientlayout"; // Adjust path if needed
import { supabaseClient } from "@/lib/supabase/client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) router.push("/login");
    };
    checkAuth();
  }, [router]);

  return (
    <SidebarProvider>
      <ClientLayout>{children}</ClientLayout>
    </SidebarProvider>
  );
}