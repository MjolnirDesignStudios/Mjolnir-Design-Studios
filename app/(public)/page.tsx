// app/page.tsx — FINAL 2026 MJÖLNIR HOMEPAGE — WORKS ON EVERY SCREEN
import CardNav from "@/components/ui/Navigation/CardNav";
import Navbar from "@/components/ui/Navigation/Navbar";
import { FloatingNav } from "@/components/ui/Navigation/FloatingNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Blocks from "@/components/Blocks";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import Forge from "@/components/Forge";


export default function Home() {
  return (
    <main className="relative bg-neutral-950 min-h-screen flex flex-col items-center overflow-x-hidden">
      {/* Floating Nav — Mobile Only */}
      <div className="block lg:hidden w-full">
        <FloatingNav />
      </div>

      {/* Navbar — Desktop Only */}
      <div className="hidden lg:block w-full">
        <Navbar />
      </div>

      {/* Hero — Always Visible */}
      <div className="w-full">
        <Hero />
      </div>

      {/* About — Always Visible */}
      <div className="w-full">
        <About />
      </div>

      {/* Block — Always Visible — Now Responsive */}
      <div className="w-full">
        <Blocks />
      </div>

      {/* Forge — Always Visible — Now Responsive */}
      <div className="w-full">
        <Forge />
      </div>

      {/* Pricing — Always Visible — Now Responsive */}
      <div className="w-full">
        <Pricing />
      </div>
    

      {/* Footer — Always Visible */}
      <div className="w-full">
        <Footer />
      </div>
    </main>
  );
}