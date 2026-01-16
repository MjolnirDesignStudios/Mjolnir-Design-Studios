// app/pricing/page.tsx
import Pricing from "@/components/Pricing";
import Navbar from "@/components/ui/Navigation/Navbar"; // Adjust path if needed
import { FloatingNav } from "@/components/ui/Navigation/FloatingNav"; // Adjust path if needed
import Footer from "@/components/Footer"; // Adjust path if needed

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-neutral-950 flex flex-col">
      {/* Desktop Navbar - Fixed at top */}
      <Navbar />

      {/* Mobile Floating Nav */}
      <FloatingNav />

      {/* Main Content - Pricing Section */}
      <main className="flex-1 pt-12 lg:pt-8"> {/* Padding to avoid overlap with fixed navbar */}
        <Pricing />
      </main>

      {/* Footer - Always at bottom */}
      <Footer />
    </div>
  );
}