// components/ui/ElectricBorder.tsx — FINAL FIXED (NO MORE ERRORS)
"use client";

import React, { CSSProperties, PropsWithChildren, useId } from 'react';

type ElectricBorderProps = PropsWithChildren<{
  color?: string;
  thickness?: number;
  className?: string;
  style?: CSSProperties;
}>;

const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = '#7DF9FF',
  thickness = 4,
  className,
  style,
}) => {
  const id = `electric-${useId().replace(/:/g, '')}`;

  return (
    <div className={`relative group ${className ?? ''}`} style={style}>
      {/* Hidden SVG Filter */}
      <svg className="fixed -left-full -top-full w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={id} x="-200%" y="-200%" width="500%" height="500%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5">
              <animate attributeName="baseFrequency" values="0.02;0.04;0.02" dur="8s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>

      {/* Electric Glow — pointer-events-none so it NEVER blocks buttons */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div 
          className="absolute inset-0 rounded-3xl border-[3px] border-transparent"
          style={{ 
            filter: `url(#${id})`, 
            borderColor: color,
            boxShadow: `0 0 40px ${color}88`
          }} 
        />
        <div 
          className="absolute inset-0 rounded-3xl border-[6px] border-transparent blur-xl opacity-60"
          style={{ borderColor: color }}
        />
      </div>

      {/* Your content (buttons) — fully clickable */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ElectricBorder;