// components/Pricing.tsx — FINAL 2026 MJÖLNIR PRICING — REVENUE LIVE — NO BUILD ERRORS
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Zap, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ElectricBorder from "@/components/ui/ElectricBorder";
import { QRCodeCanvas } from "qrcode.react";

type Tier = {
  name: string;
  subtitle: string;
  monthly?: number;
  annual?: number;
  original?: number;
  description: string;
  features: string[];
  buttonText: string;
  electricColor: string;
  buttonGradient: string;
  /** Product slug sent to the server — maps to a server-side price ID. Never send raw Stripe price IDs from the client. */
  productMonthly?: string;
  productAnnual?: string;
  popular?: boolean;
  btcAddress?: string;
  btcAmount?: string;
};

const tiers: Tier[] = [
  {
    name: "Base",
    subtitle: "For Startups",
    monthly: 10,
    annual: 100,
    original: 149,
    description: "Essential Consulting Services",
    features: [
      "Business Consultation",
      "Web Development Basics",
      "Email Support",
      "Community Access",
      "Lifetime Updates",
    ],
    buttonText: "Get Started",
    electricColor: "#7DF9FF",
    buttonGradient: "from-cyan-500 to-emerald-500",
    productMonthly: "base_monthly",
    productAnnual: "base_annual",
  },
  {
    name: "Pro",
    subtitle: "For Growing Businesses",
    monthly: 50,
    annual: 500,
    original: 749,
    description: "Advanced Consulting",
    features: [
      "Everything in Base",
      "Custom Web Services",
      "Premium Design",
      "3D Design/Modeling",
      "Commercial License",
    ],
    buttonText: "Go Pro",
    electricColor: "#34D399",
    buttonGradient: "from-emerald-500 to-lime-400",
    popular: true,
    productMonthly: "pro_monthly",
    productAnnual: "pro_annual",
  },
  {
    name: "Elite",
    subtitle: "For Enterprises",
    monthly: 500,
    annual: 5000,
    original: 7499,
    description: "Full-Service Digital Solutions",
    features: [
      "Everything in Pro",
      "1-on-1 Development",
      "Dedicated Engineer",
      "Access to OdinAI (Beta)",
      "Source Code Access",
    ],
    buttonText: "Join Elite",
    electricColor: "#F0FF42",
    buttonGradient: "from-yellow-400 to-amber-600",
    productMonthly: "elite_monthly",
    productAnnual: "elite_annual",
  },
  {
    name: "Custom",
    subtitle: "Bitcoin Only",
    description: "Powered by Bitcoin.",
    features: [
      "Any Feature You Want",
      "Access to OdinAI (Beta)",
      "Custom Built Components",
      "Lightning Fast Delivery",
      "Payments in Bitcoin Only",
    ],
    buttonText: "Pay with BTC",
    electricColor: "#FF9900",
    buttonGradient: "from-orange-500 to-orange-600",
    btcAddress: "bc1qwmg9mjq9fm5apwwnxdv2v8xkkqpfcp97n02ddz",
    btcAmount: "0.05",
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [showBtcModal, setShowBtcModal] = useState(false);

  const handleStripeCheckout = async (tier: Tier) => {
    const product = isAnnual ? tier.productAnnual : tier.productMonthly;
    if (!product) return;

    setLoading(tier.name);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Stripe API error:", res.status, res.statusText, data);
        alert(`Payment setup failed: ${data.error || 'Unknown error'}`);
        setLoading(null);
        return;
      }

      if (!data.url) {
        console.error("Stripe error - no URL in response:", data);
        alert("Payment setup failed. See console for details.");
        setLoading(null);
        return;
      }

      window.location.href = data.url;
    } catch (_err) {
      console.error("Fetch error:", _err);
      alert("Payment failed. Try again.");
      setLoading(null);
    }
  };

  return (
    <section id="pricing"
      className="py-4 mb-16 relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="heading text-silver-100 text-5xl lg:text-5xl font-bold text-center mb-4">
            Our Pricing: We Accept All Forms of <span className="text-gold">Gold!</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400">All plans include lifetime updates · We accept 
            <span className="text-orange-400"> Bitcoin!</span></p>
        </motion.div>

        <div className="flex justify-center mb-16">
          <div className="bg-zinc-900/60 backdrop-blur border border-white/10 rounded-full p-1.5 flex items-center">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn("px-8 py-3 rounded-full font-bold transition-all", !isAnnual ? "bg-emerald-500 text-black" : "text-gray-400")}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn("px-8 py-3 rounded-full font-bold transition-all", isAnnual ? "bg-emerald-500 text-black" : "text-gray-400")}
            >
              Annual <span className="text-xs opacity-70 ml-1">(Save 20%)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto px-4 sm:px-6">
          {tiers.map((tier) => {
            const price = tier.name === "Custom" ? null : (isAnnual ? tier.annual : tier.monthly);
            const period = isAnnual ? "year" : "month";

            return (
              <div key={tier.name} className="group relative">
                <ElectricBorder color={tier.electricColor} thickness={4} className="absolute inset-0 rounded-3xl z-50">
                  <div className="relative h-full p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-300 group-hover:border-white/20">
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold">
                        MOST POPULAR
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-heading font-black text-white">{tier.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{tier.subtitle}</p>
                    </div>

                    <div className="text-center mb-8">
                      {tier.name === "Custom" ? (
                        <div className="space-y-2">
                          <div className="text-4xl font-black text-orange-400">Custom</div>
                          <div className="text-gray-500 text-sm">Bitcoin Only</div>
                          <div className="text-gray-600 line-through text-lg">0.25 BTC</div>
                        </div>
                      ) : (
                        <>
                          <div className="text-5xl font-black text-white">${price}</div>
                          <div className="text-gray-500 text-sm">/{period}</div>
                          {price !== null && price !== undefined && tier.original !== undefined && price < tier.original && (
                            <div className="text-gray-600 line-through text-lg mt-2">${tier.original}</div>
                          )}
                        </>
                      )}
                    </div>

                    <p className="text-gray-400 text-center text-sm mb-8">{tier.description}</p>

                    <ul className="space-y-3 mb-10">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                          <Zap className="w-4 h-4 text-emerald-400" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="relative z-50">
                      {tier.name === "Custom" ? (
                        <motion.button
                          onClick={() => setShowBtcModal(true)}
                          className="relative w-full py-4 rounded-2xl font-bold text-black text-xl overflow-hidden shadow-2xl"
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <motion.div
                            className="absolute inset-0 rounded-2xl"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 0.8 }}
                            style={{
                              background: "radial-gradient(circle at center, #FF990088, transparent 70%)",
                              filter: "blur(20px)",
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600" />
                          <span className="relative z-10 flex items-center justify-center gap-4">
                            <Image src="/Icons/Cryptos/bitcoin-64.svg" alt="Bitcoin" width={28} height={28} />
                            <span className="tracking-wider">Pay with BTC</span>
                          </span>
                        </motion.button>
                      ) : (
                        <motion.button
                          onClick={() => handleStripeCheckout(tier)}
                          disabled={loading === tier.name}
                          className={cn(
                            "relative w-full py-4 rounded-2xl font-bold text-black text-xl overflow-hidden shadow-2xl",
                            "bg-gradient-to-r",
                            tier.buttonGradient
                          )}
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <motion.div
                            className="absolute inset-0 rounded-2xl"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 0.7 }}
                            style={{
                              background: `radial-gradient(circle at center, ${tier.electricColor}88, transparent 70%)`,
                              filter: "blur(20px)",
                            }}
                          />
                          <span className="relative z-10 flex items-center justify-center gap-3">
                            {loading === tier.name ? (
                              <>
                                <Zap className="animate-pulse w-6 h-6 text-emerald-400" />
                                Charging...
                              </>
                            ) : (
                              <>
                                <motion.span
                                  initial={{ scale: 1 }}
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                  className="tracking-wide"
                                >
                                  {tier.buttonText}
                                </motion.span>
                                <ArrowRight className="w-6 h-6" />
                              </>
                            )}
                          </span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </ElectricBorder>
              </div>
            );
          })}
        </div>

        {/* Trusted Payments */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 mb-6 text-lg">Trusted Payment Services</p>
          <div className="flex items-center justify-center lg:gap-8 sm:gap-4 gap-3 flex-nowrap">
            <Image src="/Icons/Cryptos/bitcoin-64.svg" alt="Bitcoin" width={48} height={48} className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain" />
            <Image src="/icons/payments/cash-app-64.svg" alt="CashApp" width={56} height={56} className="w-7 h-7 sm:w-11 sm:h-11 lg:w-14 lg:h-14 object-contain" />
            <Image src="/icons/payments/coinbase-64.svg" alt="Coinbase" width={56} height={56} className="w-7 h-7 sm:w-11 sm:h-11 lg:w-14 lg:h-14 object-contain" />
            <Image src="/icons/payments/stripe-64.svg" alt="Stripe" width={48} height={48} className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain" />
            <Image src="/icons/payments/uphold-64.svg" alt="Uphold" width={48} height={48} className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain" />
            <Image src="/icons/payments/venmo-64.svg" alt="Venmo" width={48} height={48} className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain" />
          </div>
        </div>
      </div>

      {/* BTC MODAL */}
      <AnimatePresence>
        {showBtcModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setShowBtcModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-950 border border-white/20 rounded-3xl p-6 sm:p-10 max-w-[95vw] sm:max-w-md w-full text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Pay with Bitcoin</h2>
              
              {/* QR Code - Centered */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl mb-6 flex items-center justify-center">
                <QRCodeCanvas 
                  value={`bitcoin:${tiers[3].btcAddress}?amount=${tiers[3].btcAmount}`} 
                  size={280}
                  level="H"
                  includeMargin={false}
                />
              </div>
              
              <p className="text-gray-400 mb-2">Send exactly</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-500 mb-6">
                0.05 BTC (~$5,000)
              </p>
              
              {/* Wallet Address Container - Two Rows */}
              <div className="bg-gray-900 border border-white/10 rounded-lg p-4 mb-4 space-y-2">
                <p className="text-xs sm:text-sm text-white font-semibold truncate">
                  Mjolnir Design Studios: Bitcoin Wallet
                </p>
                <code className="block text-xs sm:text-sm text-white truncate">
                  bc1qwmg9mjq9fm5apwwnxdv2v8xkkqpfcp97n02ddz
                </code>
              </div>
              
              <p className="text-xs text-gray-400 mb-4">
                Verify address in your Bitcoin app before sending.
              </p>
              
              <button
                onClick={() => setShowBtcModal(false)}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-xl hover:scale-105 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}