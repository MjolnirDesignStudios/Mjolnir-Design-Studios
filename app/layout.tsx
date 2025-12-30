// app/layout.tsx — FINAL: PERFECT SCROLL OFFSET + SMOOTH SCROLLING
import type { Metadata } from "next";
import { Inter, Ubuntu } from "next/font/google";
import ClientLayout from "./clientlayout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-satoshi",
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mjolnirdesignstudios.com"),
  title: {
    default: "Mjolnir Design Studios | Thunderous UI/UX",
    template: "%s • Mjolnir Design Studios",
  },
  description:
    "Premium UI/UX and web designs. Full-stack development from the Lightning Capital of the World — Tampa, Florida. We build high-performance animations for unforgettable digital experiences that strike with power.",
  keywords: [
    "web design tampa",
    "web development tampa",
    "ui ux design tampa",
    "next.js agency",
    "react developer tampa",
    "Mjolnir Design Studios",
    "MjolnirUI",
    "Mjolnir Forge",
    "thunderous ui/ux",
    "electric web design",
    "3D web experiences",
    "GSAP animation agency",
    "framer motion development",
    "premium web components",
    "web3 design studio",
    "tampa web designer",
    "florida digital agency",
    "lightning capital web design",
  ],
  authors: [{ name: "Mjolnir Design Studios", url: "https://www.mjolnirdesignstudios.com" }],
  creator: "Mjolnir Design Studios",
  publisher: "Mjolnir Design Studios",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.mjolnirdesignstudios.com",
    siteName: "Mjolnir Design Studios",
    title: "Mjolnir Design Studios • Thunderous Digital Experiences",
    description: "Electric UI/UX and web designs from Tampa — the Lightning Capital of the World",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mjolnir Design Studios – Electric Blue Hammer Striking Lightning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@MjolnirDesignsX",
    creator: "@MjolnirDesignsX",
    title: "Mjolnir Design Studios Tampa's Thunderous Web Agency",
    description: "We don’t just build websites. We bring the thunder.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: ["/favicon/favicon.ico"],
    shortcut: ["/favicon/favicon.ico"],
    apple: ["/favicon/apple-touch-icon.png"],
    other: [
      { rel: "icon", url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { rel: "icon", url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
  verification: {
    google: "your-google-site-verification",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${ubuntu.variable}`} suppressHydrationWarning>
      <head />
      <body className="font-body antialiased bg-black text-white min-h-screen">
        {/* THIS LINE FIXES EVERYTHING */}
        <div className="pt-20 lg:pt-26" /> {/* Invisible spacer = navbar height */}

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}