import * as React from "react";

import { cn } from "@/lib/utils";

type AnimatedPageProps = {
  children: React.ReactNode;
  className?: string;
};

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out motion-reduce:animate-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
