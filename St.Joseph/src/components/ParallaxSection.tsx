// import React from "react";
import type { ReactNode } from "react";

interface ParallaxSectionProps {
  imageUrl: string;
  children: ReactNode;
  overlay?: "navy" | "dark" | "gold";
  className?: string;
  minHeight?: string;
}

const overlayStyles = {
  navy: "bg-primary/80",
  dark: "bg-black/60",
  gold: "bg-secondary/70",
};

const ParallaxSection = ({
  imageUrl,
  children,
  overlay = "navy",
  className = "",
  minHeight = "min-h-[400px]",
}: ParallaxSectionProps) => (
  <section
    className={`parallax-section relative ${minHeight} flex items-center ${className}`}
    style={{ backgroundImage: `url(${imageUrl})` }}
  >
    <div className={`absolute inset-0 ${overlayStyles[overlay]}`} />
    <div className="relative z-10 w-full">{children}</div>
  </section>
);

export default ParallaxSection;