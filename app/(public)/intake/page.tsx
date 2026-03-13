// app/(public)/intake/page.tsx
"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  dob: string;
  address: string;
  email: string;
  phone: string;
  businessName: string;
  industry: string;
  currentWebsite: string;
  goals: string;
}

function IntakeFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event_id');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    dob: '',
    address: '',
    email: '',
    phone: '',
    businessName: '',
    industry: '',
    currentWebsite: '',
    goals: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit to Supabase
      const supabaseRes = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, eventId })
      });

      if (!supabaseRes.ok) throw new Error('Supabase submission failed');

      // Submit to HubSpot
      const hubspotRes = await fetch('/api/hubspot/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!hubspotRes.ok) throw new Error('HubSpot submission failed');

      alert('Thank you! Your information has been submitted successfully.');
      router.push('/success');
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Submission error:', err);
      alert('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-gold">Mjolnir Forge Intake Form</h1>
        <p className="text-gray-400 text-center mb-8">
          Please fill out this form to help us prepare for your workshop session.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-900/50 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  title="Enter full name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  placeholder="Select date of birth"
                  title="Select date of birth"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  title="Enter address"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  title="Enter email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  title="Enter phone number"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-gray-900/50 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter business name"
                  title="Enter business name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Industry *</label>
                <select
                  name="industry"
                  required
                  value={formData.industry}
                  onChange={handleChange}
                  title="Select your industry"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select Industry</option>
                  <option value="consulting">Consulting</option>
                  <option value="education">Education</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="professional services">Professional Services</option>
                  <option value="real estate">Real Estate</option>
                  <option value="technology">Technology</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Current Website (if applicable)</label>
                <input
                  type="url"
                  name="currentWebsite"
                  value={formData.currentWebsite}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  title="Enter your current website URL"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-gray-900/50 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Workshop Goals</h2>
            <div>
              <label className="block text-sm font-medium mb-2">What are your goals for attending the Mjolnir Forge workshop? *</label>
              <textarea
                name="goals"
                required
                value={formData.goals}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your website goals, challenges, and what you hope to achieve..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="text-center">
            <motion.button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-lime-400 text-black font-bold rounded-2xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Submitting...' : 'Submit Intake Form'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function IntakeForm() {
  return (
    <Suspense fallback={null}>
      <IntakeFormInner />
    </Suspense>
  );
}