// components/ui/BentoGrid.tsx — YOUR OLD FILE, UNTOUCHED
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import LightningEffect from "./Animations/LightningEffect";
import Globe from "./Animations/Globe";
import ShimmerButton from "./Buttons/ShimmerButton";
import { IoCopyOutline } from "react-icons/io5";
import Image from "next/image";
import { BifrostGradient } from "./Animations/BifrostGradients";
import { ColorfulText } from "@/components/ui/TextEffects/ColorfulText";
import { GlowingEffect } from "./Animations/GlowingEffect";
import Lottie from "lottie-react";
import Singularity from "./Animations/Singularity";


export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <>
      {/* MOBILE — TALLER, WIDER, BEAUTIFUL CARDS */}
      <div className="grid grid-cols-1 gap-8 px-4 sm:px-4 md:hidden">
        {React.Children.map(children, (child) => (
          <div className="min-h-48">{child}</div>
        ))}
      </div>

      {/* TABLET — 2 COLUMN, TALLER */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-8 px-8">
        {React.Children.map(children, (child) => (
          <div className="h-96 min-h-96 w-48 min-w-full">{child}</div>
        ))}
      </div>

      {/* DESKTOP & TABLET — YOUR ORIGINAL PERFECT LAYOUT */}
      <div
        className={cn(
          "hidden md:grid md:grid-cols-6 lg:grid-cols-5 gap-4 mx-auto px-10",
          className
        )}
      >
        {children}
      </div>
    </>
  );
};

export interface BentoGridItemProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  id?: number;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  contentType?: string;
}
export const BentoGridItem = ({
  className,
  title,
  description,
  id,
  img,
  imgClassName,
  titleClassName,
  contentType, // ADD THIS
}: BentoGridItemProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("contact@mjolnirdesignstudios.com");
    setCopied(true);
  };

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4 border border-white/[0.1]",
        className
      )}
      style={{
        background: "rgb(13,13,13)",
        backgroundColor: "linear-gradient(90deg, rgba(22,22,22,1) 0%, rgba(64,0,0,1) 70%, rgba(80,80,80,1) 100%)",
      }}
    >
      <div className={`${id === 6 && "flex justify-center"} h-full`}>
        {/* Background Image */}
        {img && (
          <Image
            src={img}
            alt={img}
            fill
            className={cn(imgClassName, "object-contain object-center")}
          />
        )}

        {/* Custom Content Layer (NEW: we inject your animations here) */}
        <div className="absolute inset-0 pointer-events-none">
          {id === 1 && (
            <div className="w-full h-full">
              <LightningEffect
              />
              <div className="absolute top-4 left-4">
                <div className="group-hover/bento:translate-x-8 transition duration-200">
                  <div className="font-bold text-3xl lg:text-3xl text-white z-10">
                    {title}
                  </div>
                  <div className="font-extralight text-gold text-lg lg:text-base z-10">
                    {description}
                  </div>
                </div>
              </div>
            </div>
          )}

          {id === 2 && (
            <div className="w-full h-full">

              {/* Static Accretion Disk Fallback Image */}
              <Image
                src="/Images/Backgrounds/Singularity.png"
                alt="Singularity"
                fill
                priority
                className="object-cover object-center scale-80"
              />
              
              <div className="absolute top-4 left-4">
                  <div className="group-hover/bento:translate-x-4 transition duration-200">
                    <div className="font-bold text-2xl lg:text-3xl text-white z-10">
                      {title}
                    </div>
                    <div className="font-extralight text-gold text-lg lg:text-base z-10">
                      {description}
                    </div>
                  </div>
                </div>
            </div>
          )}

          {id === 3 && (
          <div className="relative w-full h-full rounded-3xl">
            <Image
              src="./Images/Backgrounds/bg.png"
              alt="Asgardian Tech"
              fill
              priority
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

            <div className="absolute top-4 left-4 z-10">
              <div className="group-hover/bento:translate-x-4 transition-all duration-500 ease-out">
                <h3 className="font-black text-2xl md:text-3xl lg:text-3xl text-white drop-shadow-2xl tracking-tight">
                  {title}
                </h3>
                <p className="font-extralight text-gold text-md md:text-lg lg:text-lg drop-shadow-lg">
                  {description}
                </p>
              </div>
            </div>
          </div>
          )}

          {id === 4 && (
          <div className="relative w-full h-full overflow-visible rounded-3xl">
            {/* MJÖLNIR — FULL WIDTH, NO CROPPING, PUSHED DOWN */}
            <div className="absolute inset-0 flex items-end justify-center">
              <Image
                src="./Images/Mjolnir.jpeg"
                alt="Mjolnir"
                width={1920}
                height={1080}
                priority
                className="
                  w-full                /* Full width */
                  h-auto                /* Maintains aspect ratio */
                  max-w-none            /* Allows it to exceed container */
                  translate-y-28 md:translate-y-28 lg:translate-y-44
                  drop-shadow-2xl
                "
              />
            </div>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

            {/* Your original text — unchanged */}
            <div className="absolute top-4 left-4 z-10">
              <div className="group-hover/bento:translate-x-4 transition-all duration-500 ease-out">
                <h3 className="font-black text-2xl md:text-3xl lg:text-3xl text-white drop-shadow-2xl tracking-tight">
                  {title}
                </h3>
                <p className="font-extralight text-gold text-md md:text-lg lg:text-lg drop-shadow-lg">
                  {description}
                </p>
              </div>
            </div>

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent blur-3xl" />
            </div>
          </div>
        )}

          {id === 5 && (
          <div className="w-full h-full relative">
            {/* Force the container to have height */}
            <div className="absolute inset-0">
              <Globe 
                dark 
                scale={1.2}
                offsetX={200}
                offsetY={1200}
                className="w-full h-full"
              />
            </div>
            {/* TEXT — BOTTOM-LEFT + HOVER ANIMATION RESTORED */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <div className="group-hover/bento:translate-x-4 transition duration-200">
                <div className="font-bold text-2xl lg:text-3xl text-white">
                  {title}
                </div>
                <div className="font-extralight text-gold text-lg lg:text-base">
                  {description}
                </div>
              </div>
            </div>
          </div>
        )}
          
          {id === 6 && (
            <div className="w-full h-full overflow-hidden rounded-3xl">
              {/* BIFROST BACKGROUND — FULLY FITTING */}
              <BifrostGradient
                speed={1.3}
                intensity={1.6}
                size="100%"
                interactive={true}
                className="absolute inset-0"
              />

              {/* CONTENT — EXACT SAME STYLE & SIZE AS YOUR OLD BOX 6 */}
              <div className="absolute top-4 items-center w-full">
                <div className="group-hover/bento:translate-y-2 transition duration-200">
                  <div className="relative z-10 flex h-full flex-col justify-end px-5 text-center">
                    {/* Title — same size as old project */}
                    <div className="font-sans font-bold text-3xl lg:text-4xl text-white z-10">
                      Open the 
                      <ColorfulText text=" Bifrost!" className="inline-block text-3xl md:text-2xl lg:text-3xl"> 
                      </ColorfulText>
                    </div>

                    {/* Description — same gold, same size */}
                    <div className="font-sans font-bold text-gold text-lg md:text-base lg:text-lg z-10 mb-2">
                      {description || "Ready to forge something legendary?"}
                    </div>
                  </div>
                </div>
                {/* Shimmer Button — exact same position as before */}
                    <div className="relative flex z-20 items-center justify-center mt-2 mb-2 pointer-events-auto">
                      <ShimmerButton
                        title={copied ? "Email copied" : "Copy Email"}
                        icon={<IoCopyOutline />}
                        position="left"
                        otherClasses="mx-auto relative z-10"
                        handleClick={() => {
                          handleCopy();
                        }}
                      />
                    </div>
              </div>
            </div>
          )}



        </div>

          {/* Text */}
          <div
            className={cn(
              titleClassName,
              "group-hover/bento:translate-x-2 transition duration-200 relative p-4 lg:p-10 flex flex-col"
            )}
          >
        
          </div>
      </div>
    </div>
  );
};