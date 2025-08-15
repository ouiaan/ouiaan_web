import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function SectionTitle({ children, className, ...props }: SectionTitleProps) {
  return (
    <h2
      className={cn(
        "font-headline text-4xl md:text-5xl lg:text-6xl text-center text-foreground mb-4",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
