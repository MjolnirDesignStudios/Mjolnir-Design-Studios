"use client";

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import Navbar from "@/components/ui/Navigation/Navbar"; // Your existing path
import Footer from "@/components/Footer"; // Your existing path

export default function AgreementPage() {
  const clientSigRef = useRef<SignatureCanvas>(null);
  const agencySigRef = useRef<SignatureCanvas>(null);
  const [packageType, setPackageType] = useState<"pro" | "elite">("pro");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    clientName: "",
    clientTitle: "",
    clientAddress: "",
    clientEmail: "",
  });

  const pricing = {
    pro: { name: "Pro Package", price: "$8,500" },
    elite: { name: "Elite Package", price: "$14,950" }, // Adjust as needed
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientSigRef.current?.isEmpty() && !agencySigRef.current?.isEmpty()) {
      const clientSig = clientSigRef.current?.toDataURL();
      const agencySig = agencySigRef.current?.toDataURL();
      // Send to backend: formData, packageType, clientSig, agencySig
      console.log("Signed!", { ...formData, packageType, clientSig, agencySig });
      alert("Agreement signed! (Hook up backend to save/email PDF)");
    } else {
      alert("Please provide both signatures.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-12 text-gold">
            BUSINESS SERVICES AGREEMENT
          </h1>

          {/* Package Selector */}
          <div className="mb-12 text-center">
            <p className="text-2xl mb-6">Select Your Web Design Package</p>
            <div className="flex justify-center gap-8">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="package"
                  checked={packageType === "pro"}
                  onChange={() => setPackageType("pro")}
                  className="sr-only"
                />
                <div className={`p-6 border-2 rounded-lg transition ${packageType === "pro" ? "border-gold bg-gold/10" : "border-white/20"}`}>
                  <h3 className="text-2xl font-bold">Pro Package</h3>
                  <p className="text-4xl font-black mt-2">$8,500</p>
                </div>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="package"
                  checked={packageType === "elite"}
                  onChange={() => setPackageType("elite")}
                  className="sr-only"
                />
                <div className={`p-6 border-2 rounded-lg transition ${packageType === "elite" ? "border-gold bg-gold/10" : "border-white/20"}`}>
                  <h3 className="text-2xl font-bold">Elite Package</h3>
                  <p className="text-4xl font-black mt-2">$14,950</p>
                  <p className="text-sm text-gray-400 mt-2">(Includes SEO, CRM, Maintenance add-ons)</p>
                </div>
              </label>
            </div>
            <p className="mt-4 text-xl">Selected: <strong>{pricing[packageType].name} — {pricing[packageType].price}</strong></p>
          </div>

          {/* Full Contract Text */}
          <div className="prose prose-invert max-w-none text-lg leading-relaxed space-y-6">
            <p>This Business Services Agreement (“Agreement”) is made and entered into as of {formData.date || "[DATE]"}, by and between:</p>
            <p><strong>1984 Holdings LLC DBA Mjolnir Design Studios</strong><br />Address: [AGENCY ADDRESS]<br />(“Agency”)</p>
            <p>and</p>
            <p><strong>Fullview Lanai Enclosures LLC</strong><br />Address: {formData.clientAddress || "[CLIENT ADDRESS]"}<br />(“Client”)</p>
            {/* Paste the rest of your contract sections 1-16 + Schedules here, using <h2>, <p>, <ul> for formatting */}
            <h2 className="text-2xl font-bold mt-12">4. Fees & Payment</h2>
            <p>Total Estimated Fees: {pricing[packageType].name} {pricing[packageType].price} (see itemized Schedule B). Optional add-ons priced separately.</p>
            {/* ... continue full text ... */}
          </div>

          {/* Signable Form */}
          <form onSubmit={handleSubmit} className="mt-20 space-y-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xl mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
                  required
                  title="Select date"
                  placeholder="Select date"
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Client Email</label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
                  required
                  placeholder="Enter your email address"
                  title="Client Email"
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Client Name</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
                  required
                  placeholder="Enter your full name"
                  title="Client Name"
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Client Title</label>
                <input
                  type="text"
                  value={formData.clientTitle}
                  onChange={(e) => setFormData({...formData, clientTitle: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
                  required
                  placeholder="Enter your title"
                  title="Client Title"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xl mb-2">Client Address</label>
                <textarea
                  rows={3}
                  value={formData.clientAddress}
                  onChange={(e) => setFormData({...formData, clientAddress: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
                  required
                  placeholder="Enter your address"
                  title="Client Address"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Agency Signature</h2>
                <SignatureCanvas ref={agencySigRef} penColor="#00f0ff" canvasProps={{ className: "border border-gold/50 rounded-lg bg-black w-full h-48" }} />
                <button type="button" onClick={() => agencySigRef.current?.clear()} className="mt-2 px-4 py-2 bg-red-900 rounded">Clear</button>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Client Signature</h2>
                <SignatureCanvas ref={clientSigRef} penColor="#00f0ff" canvasProps={{ className: "border border-gold/50 rounded-lg bg-black w-full h-48" }} />
                <button type="button" onClick={() => clientSigRef.current?.clear()} className="mt-2 px-4 py-2 bg-red-900 rounded">Clear</button>
              </div>
            </div>

            <div className="text-center">
              <label className="text-xl">
                <input type="checkbox" required className="mr-3" />
                I agree to the terms of this Agreement.
              </label>
              <button type="submit" className="mt-8 px-12 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xl rounded-full hover:scale-105 transition">
                Submit & Sign Agreement
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}