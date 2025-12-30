// components/Pricing.tsx — FINAL 2026 MJÖLNIR PRICING — REVENUE LIVE — NO BUILD ERRORS
"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Zap, ArrowRight, Bitcoin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ElectricBorder from "@/components/ui/ElectricBorder";
import { QRCodeCanvas } from "qrcode.react";

const tiers = [
  {
    name: "Base",
    subtitle: "For Creators",
    monthly: 10,
    annual: 100,
    original: 149,
    description: "Are You Worthy?",
    features: [
      "All MjolnirUI Components",
      "Basic Animations & Effects",
      "Email Support",
      "Community Access",
      "Lifetime Updates",
    ],
    buttonText: "Get Started",
    electricColor: "#7DF9FF",
    buttonGradient: "from-cyan-500 to-emerald-500",
    stripePriceIdMonthly: "price_1SdGLZFxkFUD7EnZJbUPdiP6",
    stripePriceIdAnnual: "price_1SdG59FxkFUD7EnZsjsdT2pa",
  },
  {
    name: "Pro",
    subtitle: "For Professionals",
    monthly: 50,
    annual: 500,
    original: 749,
    description: "Wield the Power of Mjölnir!",
    features: [
      "Everything in Base",
      "Advanced GSAP Animations",
      "Priority Support",
      "Custom Component Requests",
      "Commercial License",
    ],
    buttonText: "Go Pro",
    electricColor: "#34D399",
    buttonGradient: "from-emerald-500 to-lime-400",
    popular: true,
    stripePriceIdMonthly: "price_1SdHO8FxkFUD7EnZn7ntnR3I",
    stripePriceIdAnnual: "price_1SdHAqFxkFUD7EnZJgRjye5s",
  },
  {
    name: "Elite",
    subtitle: "For Agencies",
    monthly: 500,
    annual: 5000,
    original: 7499,
    description: "Thunderous UI/UX.",
    features: [
      "Everything in Pro",
      "1-on-1 Onboarding",
      "Dedicated Engineer",
      "Custom Development",
      "Source Code Access",
    ],
    buttonText: "Join Elite",
    electricColor: "#F0FF42",
    buttonGradient: "from-yellow-400 to-amber-600",
    stripePriceIdMonthly: "price_1SdHuoFxkFUD7EnZIt8MeINJ",
    stripePriceIdAnnual: "price_1SdHpQFxkFUD7EnZq9jBzUQE",
  },
  {
    name: "Custom",
    subtitle: "Bitcoin Only",
    description: "Powered by Bitcoin.",
    features: [
      "Any Feature You Want",
      "Direct Access to Thor",
      "Custom Built Components",
      "Lightning Delivery",
      "Paid in Bitcoin Only",
    ],
    buttonText: "Pay with BTC",
    electricColor: "#FF9900",
    buttonGradient: "from-orange-500 to-orange-600",
    btcAddress: "bc1qwmg9mjq9fm5apwwnxdv2v8xkkqpfcp97n02ddz",
    btcAmount: "0.057",
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [showBtcModal, setShowBtcModal] = useState(false);

  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const headers: HeadersInit = {};
        if (process.env.NEXT_PUBLIC_COINGECKO_API_KEY) {
          headers["x-cg-pro-api-key"] = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
        }
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd", { headers });
        const data = await res.json();
        setBtcPrice(data.bitcoin.usd);
      } catch (err) {}
    };
    fetchBtcPrice();
    const interval = setInterval(fetchBtcPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleStripeCheckout = async (tier: any) => {
    const priceId = isAnnual ? tier.stripePriceIdAnnual : tier.stripePriceIdMonthly;
    if (!priceId) return;

    setLoading(tier.name);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, mode: "subscription" }), // Always subscription
      });

      const data = await res.json();

      if (!data.url) {
        console.error("Stripe error:", data);
        alert("Payment setup failed. See console.");
        setLoading(null);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Payment failed. Try again.");
      setLoading(null);
    }
  };

  return (
    <section id="pricing"
      className="py-4 mb-16 relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="heading text-silver-100 text-5xl lg:text-5xl font-bold text-center mb-4">
            Our Pricing: We Accept All Forms of <span className="text-gold">Gold!</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400">All plans include lifetime updates · We accept 
            <span className="text-orange-400"> Bitcoin!</span></p>
        </motion.div>

        <div className="flex justify-center mb-16">
          <div className="bg-zinc-900/60 backdrop-blur border border-white/10 rounded-full p-1.5 flex items-center">
            <button
              onClick={() => setIsAnnual(true)}
              className={cn("px-8 py-3 rounded-full font-bold transition-all", isAnnual ? "bg-emerald-500 text-black" : "text-gray-400")}
            >
              Annual <span className="text-xs opacity-70 ml-1">(Save 20%)</span>
            </button>
            <button
              onClick={() => setIsAnnual(false)}
              className={cn("px-8 py-3 rounded-full font-bold transition-all", !isAnnual ? "bg-emerald-500 text-black" : "text-gray-400")}
            >
              Monthly
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
                            {/* REAL BITCOIN SVG FROM YOUR PUBLIC FOLDER */}
                            <img src="/Icons/Cryptos/bitcoin-64.svg" alt="Bitcoin" className="w-7 h-7" />
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
          <div className="flex items-center justify-center lg:gap-8 gap-4 flex-wrap">
            <img src="/Icons/Cryptos/bitcoin-64.svg" alt="Bitcoin" className="w-12 h-12" />
            <img src="/icons/payments/cash-app-64.svg" alt="CashApp" className="w-14 h-14" />
            <img src="/icons/payments/coinbase-64.svg" alt="Coinbase" className="w-14 h-14" />
            <img src="/icons/payments/stripe-64.svg" alt="Stripe" className="w-12 h-12" />
            <img src="/icons/payments/uphold-64.svg" alt="Uphold" className="w-12 h-12" />
            <img src="/icons/payments/venmo-64.svg" alt="Venmo" className="w-12 h-12" />
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
              className="bg-gray-950 border border-white/20 rounded-3xl p-10 max-w-md w-full text-center"
            >
              <h2 className="text-3xl font-bold text-gold mb-6">Pay with Bitcoin</h2>
              <div className="bg-white p-8 rounded-2xl mb-6">
                <QRCodeCanvas 
                  value={`bitcoin:${tiers[3].btcAddress}?amount=${tiers[3].btcAmount}`} 
                  size={240}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-gray-400 mb-2">Send exactly</p>
              <p className="text-2xl font-bold text-orange-500 mb-6">
                {tiers[3].btcAmount} BTC {btcPrice ? `(~$${Math.round(Number(tiers[3].btcAmount) * btcPrice).toLocaleString()})` : "(~$5,000)"}
              </p>
              <code className="block text-sm text-gray-500 break-all bg-gray-900 p-4 rounded-lg mb-4">{tiers[3].btcAddress}</code>
              <p className="text-xs text-gray-600 mb-6">Verify address in your Trezor app before sending.</p>
              <button
                onClick={() => setShowBtcModal(false)}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl hover:scale-105 transition"
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