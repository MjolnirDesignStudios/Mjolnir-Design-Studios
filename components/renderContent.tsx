// components/renderContent.tsx
"use client";

import { BifrostGradient } from "@/components/ui/Animations/BifrostGradient";
import Galactic from "@/components/ui/Animations/Galactic";
import LightningEffect from "@/components/ui/Animations/LightningEffect";
import ShimmerButton from "@/components/ui/Buttons/ShimmerButton";
import { Globe } from "@/components/ui/Animations/Globe";
import { GridItem } from "@/data";
import { useState } from "react";

export const renderContent = (item: GridItem) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText("contact@mjolnirdesignstudios.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  switch (item.contentType) {
    case "mjolnir":
      return null; // Image + text handled by BentoGridItem
    case "galactic":
      return <Galactic speed={0.8} intensity={3} size={1.8} waveStrength={2.2} colorShift={1.7} className="absolute inset-0 -z-10" />;
    case "tech-stack":
      return <div className="text-center">3D Tech Stack Coming Soon</div>;
    case "lightning":
      return <LightningEffect hue={220} speed={1.2} intensity={1.4} size={1.3} className="absolute inset-0 -z-10" />;
    case "midgard":
      return (
        <div className="h-full flex flex-col justify-end p-8">
          <Globe dark scale={1.125} offsetX={320} offsetY={64} />
          <ShimmerButton
            title={copied ? "Copied!" : "Connect"}
            position="center"
            handleClick={handleCopy}
            otherClasses="mt-8"
          />
        </div>
      );
    case "bifrost":
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <BifrostGradient className="absolute inset-0 rounded-3xl" interactive speed={10} />
          <ShimmerButton
            title={copied ? "Worthy!" : "Prove Your Worth"}
            position="center"
            handleClick={handleCopy}
            otherClasses="px-12 py-6 text-2xl font-bold"
          />
        </div>
      );
    default:
      return null;
  }
};