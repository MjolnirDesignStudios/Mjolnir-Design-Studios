// app/(public)/forge/page.tsx
import Navbar from "@/components/ui/Navigation/Navbar";
import Footer from "@/components/Footer";
import WorkshopSignup from "@/components/WorkshopSignup";

export default function ForgePage() {
  return (
    <main className="relative bg-neutral-950 min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Workshop Signup Section */}
      <div className="w-full">
        <WorkshopSignup />
      </div>

      {/* Footer */}
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </main>
  );
}