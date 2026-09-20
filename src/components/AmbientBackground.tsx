"use client";

import React from "react";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]" style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }} aria-hidden="true">
      {/* Monochrome ambient light */}
      <div className="absolute top-[5%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-white/6 blur-[100px] animate-breathe-one" style={{ willChange: "transform" }} />
      <div className="absolute top-[25%] right-[5%] w-[30vw] h-[30vw] rounded-full bg-white/4 blur-[90px] animate-breathe-two" style={{ willChange: "transform" }} />
      <div className="absolute bottom-[5%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-white/5 blur-[100px] animate-breathe-three" style={{ willChange: "transform" }} />
      <div className="absolute bottom-[20%] right-[15%] w-[28vw] h-[28vw] rounded-full bg-white/3 blur-[90px] animate-breathe-four" style={{ willChange: "transform" }} />

      {/* Subtle radial overlay for a touch of cinematic framing */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40" />
    </div>
  );
}
