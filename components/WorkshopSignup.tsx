// components/WorkshopSignup.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Calendar, QrCode, Users, Zap } from "lucide-react";
import ElectricBorder from "@/components/ui/ElectricBorder";

export default function WorkshopSignup() {
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "workshop_live" }),
      });

      const data = await res.json();

      if (!data.url) {
        console.error("Stripe error:", data);
        alert("Payment setup failed. See console.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Payment failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <section id="forge" className="py-16 relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="heading text-silver-100 text-5xl lg:text-5xl font-bold text-center mb-4">
            Mjolnir <span className="text-gold">Forge</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400">
            Forge a modern website with our live workshops.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Live Workshop Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <ElectricBorder color="#34D399" thickness={4} className="h-full">
              <div className="relative h-full p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-heading font-black text-white mb-2">
                    Live Workshop - <span className="text-gold">$500</span>
                  </h3>
                  <p className="text-gray-400 text-sm">In-Person Experience</p>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    <span>Schedule First, Pay Later</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <span>Limited seats available</span>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm mb-4">Scan QR code to schedule, then pay</p>
                  <div className="bg-white p-4 rounded-2xl inline-block mb-4">
                    <QRCodeCanvas value="https://calendly.com/mjolnirdesignstudios/mjolnir-forge-live" size={150} level="H" />
                  </div>
                  <motion.button
                    onClick={handleStripeCheckout}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-lime-400 text-black font-bold text-lg rounded-xl hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Book/Pay Now - $500
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </ElectricBorder>
          </motion.div>

          {/* Webinar Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="h-full"
          >
            <ElectricBorder color="#F0FF42" thickness={4} className="h-full">
              <div className="relative h-full p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-heading font-black text-white mb-2">
                    Live Webinar - <span className="text-gold">$250</span>
                  </h3>
                  <p className="text-gray-400 text-sm">Virtual Experience</p>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    <span>Coming Soon</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Users className="w-5 h-5 text-yellow-400" />
                    <span>Limited Seating (4 seats) - Friday Only</span>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm mb-4">QR Code Coming Soon</p>
                  <div className="bg-gray-700 p-4 rounded-2xl inline-block mb-4">
                    <div className="w-[150px] h-[150px] bg-gray-600 rounded flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="text-center mt-auto">
                  <button
                    disabled
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-bold rounded-2xl opacity-50 cursor-not-allowed"
                  >
                    <QrCode className="w-6 h-6" />
                    Coming Soon
                  </button>
                </div>
              </div>
            </ElectricBorder>
          </motion.div>
        </div>
      </div>
    </section>
  );
}