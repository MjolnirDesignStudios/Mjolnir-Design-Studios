// app/success/page.tsx
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <CheckCircle className="w-32 h-32 text-emerald-500 mx-auto mb-8" />
        <h1 className="text-6xl font-black text-gold mb-6">WELCOME TO THE MJÖLNIRUI FORGE</h1>
        <p className="text-2xl text-gray-300 mb-8">
          You have lifted the mighty Mjolnir! The power of thunder is yours to command!
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/dashboard" className="px-12 py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xl rounded-2xl hover:scale-105 transition">
            Build Your Empire
          </Link>
          <Link href="/components" className="px-12 py-6 border-2 border-gold text-gold font-bold text-xl rounded-2xl hover:bg-gold/10 transition">
            Browse Components
          </Link>
        </div>
      </div>
    </div>
  );
}