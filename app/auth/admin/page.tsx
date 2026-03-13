"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Hammer, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const adminEmails = ["contact@mjolnirdesignstudios.com", "admin@mjolnirdesignstudios.com"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate admin email
    if (!adminEmails.includes(email.toLowerCase())) {
      setError("Access denied. This dashboard is restricted to authorized administrators only.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: "Christopher Chiodo",
              role: "Founder & Creative Director"
            }
          }
        });

        if (error) throw error;

        if (data.user && !data.session) {
          setError("Check your email for the confirmation link");
        } else {
          router.push("/admin");
        }
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        router.push("/admin");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold to-gold-hover rounded-2xl mb-4">
            <Hammer className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-silver-100 mb-2">Mjolnir Admin</h1>
          <p className="text-silver-400">Business Command Center Access</p>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-silver-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-silver-100 placeholder-silver-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="contact@mjolnirdesignstudios.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-silver-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-silver-100 placeholder-silver-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-silver-500 hover:text-silver-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-silver-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-silver-100 placeholder-silver-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold to-gold-hover text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : (isSignUp ? "Create Admin Account" : "Access Dashboard")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-gold hover:text-gold-hover text-sm font-medium transition-colors"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need to create an account? Sign Up"}
            </button>
          </div>

          <div className="mt-6 p-4 bg-neutral-800/50 rounded-lg">
            <p className="text-xs text-silver-500 text-center">
              <strong>Authorized Access Only</strong><br />
              This dashboard contains sensitive business data and is restricted to Mjolnir Design Studios administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}