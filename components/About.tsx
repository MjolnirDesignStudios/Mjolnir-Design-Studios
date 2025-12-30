// components/About.tsx — FINAL: PERFECT HEIGHT, ORIGINAL TEXT SIZES
import React from "react";
import { gridItems } from "@/data";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";

export default function About() {
  return (
    <section id="about" className="py-4 mb-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center mb-10">
          <h1 className="heading text-silver-100 text-5xl lg:text-5xl font-bold text-center mb-4">
            Thunderous <span className="text-gold">UI/UX</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto">
            Premium Components Built for Asgardians!
          </p>
        </div>

        <BentoGrid>
          {gridItems.map((item) => (
            <BentoGridItem
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              className={item.className}
              img={item.img}
              imgClassName={item.imgClassName}
              titleClassName={item.titleClassName}
              contentType={item.contentType}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}