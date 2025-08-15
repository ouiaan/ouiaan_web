"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export const Spotlight = ({
  className,
  fill,
}: {
  className?: string;
  fill?: string;
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute -inset-px z-30 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <div className="pointer-events-none absolute -inset-px bg-grid-slate-900/10 transition-colors duration-200" />
      <motion.div
        className="pointer-events-none absolute -inset-px bg-[radial-gradient(120px_circle_at_var(--x)_var(--y),#FFFFFF0f,transparent_40%)]"
        style={{
          "--x": mouseX,
          "--y": mouseY,
        }}
      />
    </div>
  );
};
